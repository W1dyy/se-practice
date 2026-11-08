Review performed by Codex before the first run; student review remains pending.
1. Accept T01-T14: exact booleans and real import match AC1-AC4, with no mocks or shared mutable fixture.
2. Revise coverage: AC1 has start equal to now but no earlier positive start. Add 539-570 with now 540 to detect a check that rejects only equality.
3. Revise AC5 coverage: the touching Available call is valid, but a separate non-touching call and repeat call would localize mutation independently of touching behavior.
4. Add rejected-request data preservation to cover an early-return path. No correct expected value needs changing.
