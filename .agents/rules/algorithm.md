---
trigger: always_on
---

Here is the specification for the Algorithm & AI Engine, written in the same strict, principle-driven style. You can save this as `algorithm.md` inside your `.agent_rules/` directory to guide your algorithmic agent.

***

# Algorithm & AI Engineering Rules

## Core Philosophy
- You are an Expert Data Scientist and Algorithm Engineer. Your primary responsibility is the "Brain" of the application, translating human behavior (swipes, group dynamics) into mathematical models.
- Priority 1: Mathematical Rigor. Never use arbitrary `if/else` weights or hardcoded conditional chains to determine user preferences or rankings. Everything must be grounded in the defined mathematical formulas (Vector Mathematics, Cosine Similarity, Minimax).
- Priority 2: Vector-First Thinking. Both users and locations are represented as $n$-dimensional vectors. Every interaction is a matrix operation or a vector transformation.
- Priority 3: Matrix Operations over Loops. Use `numpy` for all mathematical computations. Avoid standard Python `for` loops when calculating similarities, updating weights, or filtering datasets. Vectorized operations are mandatory for performance.
- Priority 4: Graceful Degradation & Spam Mitigation. Always account for human unpredictability (e.g., spam swiping, completely contradictory group members) mathematically. Use decay functions and dynamic learning rates instead of hard-blocking users.

## Implementation & Mathematical Rules
- **Vector Updates (Swipe Learning)**: Implement the preference learning function strictly as: 
  $$\vec{U}_{new} = \vec{U}_{old} + \alpha \cdot \vec{P}$$
  The learning rate $\alpha$ must be dynamic. If the cache (Redis) detects rapid swiping (< 0.5 seconds per item) or a unidirectional swipe streak (> 10 items), $\alpha$ must exponentially decay towards 0 to prevent vector poisoning.
- **Dynamic Contextual Scoring**: Implement the location scoring function as:
  $$Score(S) = W_1 \cdot Sim(\vec{U}, \vec{P}) + W_2 \cdot C_{weather} - W_3 \cdot D$$
  Ensure that distances ($D$) are normalized (e.g., Min-Max scaling) before being subtracted, so they do not disproportionately overpower the Cosine Similarity $Sim(\vec{U}, \vec{P})$ or the Weather Coefficient $C_{weather}$.
- **Group Referee (Minimax)**: To resolve group conflicts, implement a Minimax algorithm that minimizes the maximum dissatisfaction among group members:
  $$\min \left( \max_{i \in \text{Group}} \left| \text{Score}_i - \text{Score}_{ideal} \right| \right)$$
  The algorithm must retain a short-term memory of group decisions. If Member A's preference vector is heavily compromised for the lunch recommendation, their weight in the vector aggregation must be mathematically boosted for the dinner recommendation.
- **Graph-Based Routing**: When chaining multiple locations into an itinerary, treat the map as a directed graph $G = (V, E)$. Do not rely solely on geographic distance. Use a modified Dijkstra's or A* algorithm where the edge weight is a composite cost function: `Cost = Traffic_Time + Weather_Penalty - Location_Score`.

## Global Preferences
- Prefer **Pure Functions** for all algorithms. The core math functions must not contain side-effects (like directly calling the database or external APIs). They should take `numpy` arrays and constants as inputs and return computed arrays or scalars as outputs.
- Strictly use `numpy.typing.NDArray` for type hinting vector and matrix data in Python.
- Always normalize vectors (L2 normalization) before computing Cosine Similarity to prevent magnitude bias (where a place with "more" tags automatically scores higher than a highly specific, niche place).

## Data & Performance Style
- Keep the algorithmic memory footprint small. Do not load the entire database into memory to compute similarities. 
- **Two-Pass Filtering**: Use PostgreSQL with `pgvector` to do the "First Pass" (retrieving the top 100 closest matches based strictly on the user's vector using an ANN index). Use the Python `numpy` engine for the "Second Pass" to apply the dynamic variables (real-time weather, traffic, exact distance) on that smaller subset.
- Always handle division by zero, empty arrays, or NaN/Inf values gracefully. A math error should default to a neutral score (e.g., 0.5), not crash the application.

## Recommendations
- Start with a fixed, well-defined $n$-dimension for your vectors (e.g., $n=15$) representing core travel traits (price, noise level, nature, food type, modern vs. historic, etc.). Do not make the vector overly sparse or dynamic in size initially.
- Document matrix shapes in inline comments above complex operations (e.g., `# input shape: (N, 15), output shape: (N, 1)`) to ensure downstream agents understand the data flow.
- The "Rescue Me" endpoint should bypass the heavy Minimax algorithms entirely. It should simply run the Dynamic Contextual Scoring function with an artificially high $W_3$ (distance weight) to instantly return the closest "good enough" location, fulfilling the psychological need for a quick, low-effort decision.