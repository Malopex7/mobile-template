# Error Log
Log known issues and troubleshooting steps here.
1. **Invalid hook call**: Can happen in monorepos if React versions are mismatched or hoisted incorrectly. Ensure mobile uses `expo` versions precisely.
2. **Socket.io connection drops**: Usually standard across environments, verify your load balancer supports WebSockets.
