# Real-time Flow Summary

1. Learner logs in -> receives JWT.
2. Learner loads published catalog.
3. Learner creates enrollment (`pending_payment`).
4. Learner starts checkout (mock-esewa/mock-khalti).
5. Callback updates payment status.
6. On success, enrollment becomes `paid` and access becomes `active`.
7. Socket events push status updates to learner and admin dashboards.
