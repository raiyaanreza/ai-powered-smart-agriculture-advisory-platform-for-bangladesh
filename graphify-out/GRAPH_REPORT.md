# Graph Report - .  (2026-05-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 101 nodes · 100 edges · 26 communities (22 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1915f494`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 12 edges
2. `Button()` - 3 edges
3. `useChart()` - 3 edges
4. `alertVariants` - 2 edges
5. `Alert()` - 2 edges
6. `badgeVariants` - 2 edges
7. `Badge()` - 2 edges
8. `buttonVariants` - 2 edges
9. `ChartTooltipContent()` - 2 edges
10. `ChartLegendContent()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (26 total, 4 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (9): ChartConfig, ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), INITIAL_DIMENSION, THEMES, TooltipNameType (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.31
Nodes (4): cn(), Badge(), badgeVariants, Skeleton()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (6): AI_CONFIG, SYSTEM_PROMPTS, User, UserDTO, UserRole, UserSchema

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (3): health_check(), API Gateway Service - Entry Point, Health check endpoint

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (3): geistMono, geistSans, metadata

## Knowledge Gaps
- **18 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `THEMES`, `INITIAL_DIMENSION` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._