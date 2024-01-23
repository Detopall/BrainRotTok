# Open a new PowerShell terminal for the server
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", "cd .\brain-rot-tok-server; pip install pipenv; pipenv install; pipenv shell; python .\server.py"
)

# Open another PowerShell terminal for the client
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", "cd .\brain-rot-tok-client; npm i; npm run dev"
)

# Wait for a sufficient time for the server and client to start (adjust the sleep duration as needed)
Start-Sleep -Seconds 10

# Open Firefox on the specified URL
Start-Process "firefox" -ArgumentList "http://127.0.0.1:5173/"
