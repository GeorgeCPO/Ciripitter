# Ciripitter — System Architecture

## Diagram

```mermaid
flowchart TD
    subgraph Clients[" "]
        Browser["Web Browser / Mobile App"]
    end

    subgraph Edge["Edge"]
        DNS["DNS Server"]
        CDN["CDN"]
        S3[("S3 / Object Storage\n(chirp media)")]
    end

    LB{{"Load Balancer\n196.21.1.5\n⚠ SPOF — needs redundant pair"}}

    subgraph AppLayer["Application Layer — stateless, horizontally scalable"]
        S1["Server 1\n10.0.0.1"]
        S2["Server 2\n10.0.0.2"]
    end

    subgraph Auth["Auth — JWT (stateless, no shared session store needed)"]
        RL["Rate Limiter\n(per-IP + per-user, enforced at server)"]
    end

    subgraph AsyncLayer["Async Processing"]
        MQ["Message Queue\nKafka / RabbitMQ"]
        Worker["Fan-out Workers\n(timeline population)"]
    end

    subgraph DataLayer["Data Layer"]
        Master[("Master DB\nPostgreSQL\nWrites only")]
        Replica[("Replica DB\nPostgreSQL\nReads only")]
        Cache[("Cache\nRedis\n⚠ SPOF — use Sentinel or Cluster")]
    end

    Browser -->|"1. Resolve mysite.com"| DNS
    DNS -->|"196.21.1.5"| Browser
    Browser -->|"2. Fetch static assets / media"| CDN
    CDN -->|"Cache miss"| S3
    Browser -->|"3. API requests"| LB
    LB -->|"Private IP 10.0.0.1"| S1
    LB -->|"Private IP 10.0.0.2"| S2

    S1 --> RL
    S2 --> RL

    S1 -->|"Writes"| Master
    S2 -->|"Writes"| Master
    S1 -->|"Reads"| Replica
    S2 -->|"Reads"| Replica
    Master -->|"Async replication"| Replica
    S1 <-->|"Read / Write"| Cache
    S2 <-->|"Read / Write"| Cache

    S1 -->|"Publish: chirp posted, follow, like"| MQ
    S2 -->|"Publish: chirp posted, follow, like"| MQ
    MQ --> Worker
    Worker -->|"Fan-out: push chirp to follower timeline caches"| Cache
    Worker -->|"Persist async side-effects"| Master
```

---

## Key Design Decisions

### Read / Write Split
All writes go to the Master DB. All reads go to the Replica. This is the primary
horizontal scaling lever for a read-heavy workload like a social feed.

**Replication lag caveat:** the replica is not instant. A user who just posted a
chirp and immediately refreshes their own profile may not see it (their read hits
the replica, which hasn't caught up). Mitigation: *read-your-writes consistency* —
for a short TTL after a write, route that specific user's reads to master (tracked
via a flag in Cache or a sticky cookie).

### Cache Strategy
Redis holds:
- Precomputed timelines (list of chirp IDs per user)
- Hot chirps and user profiles
- Rate-limit counters
- Read-your-writes flags (short TTL)

Cache invalidation triggers: chirp deleted, user profile updated, follow/unfollow.

### Fan-out Strategy
When a chirp is posted it must appear in every follower's timeline.

| Strategy | Writes | Reads | Problem |
|---|---|---|---|
| Fan-out on write | expensive | O(1) | Breaks for celebrity accounts (10M+ followers) |
| Fan-out on read  | cheap | expensive | Slow timelines at scale |
| **Hybrid** (target) | moderate | fast | Default: fan-out on write. For accounts above a follower threshold → fan-out on read, merged at query time |

Start with fan-out on write (simpler). Introduce the hybrid when follower counts
make it necessary.

### Auth
JWT (stateless). Tokens are verified at the server layer without a DB or cache
round-trip, which is essential for horizontal scaling. Refresh tokens stored in
Cache (Redis) so they can be revoked.

### Rate Limiting
Enforced at the application server before any DB or cache access. Two dimensions:
- Per IP (unauthenticated requests)
- Per user ID (authenticated requests)

Counters live in Redis with a sliding window or token bucket algorithm.

### SPOFs to Address Before Production
1. **Load Balancer** — deploy a redundant pair with keepalived/VRRP, or use a
   managed LB (AWS ALB, GCP LB) which handles this internally.
2. **Master DB** — configure automatic failover (Patroni + etcd for PostgreSQL)
   so a replica is promoted if master dies.
3. **Redis** — use Redis Sentinel (auto-failover) or Redis Cluster (sharding +
   failover).

---

## Build Order
1. Core schema: users, chirps, follows, likes
2. JWT auth (register, login, refresh, revoke)
3. Chirp CRUD + basic timeline (fan-out on read to start)
4. Cache layer: timeline caching, profile caching
5. Rate limiting
6. Message queue + fan-out workers
7. Read replica routing + read-your-writes consistency
8. Media uploads → S3
