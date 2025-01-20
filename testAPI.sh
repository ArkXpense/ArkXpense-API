
#!/bin/bash

# This script the API with the given parameters

# 1) Run npm run dev
# 2) Make this script executable with chmod +x testAPI.sh
# 3) Install curl with sudo apt-get install curl
# 4) Run the script with ./testAPI.sh


BASE_URL="http://localhost:3000"
LOG_FILE="testAPI.log"
> "$LOG_FILE"

print_message() {
  echo -e "\n\033[1;34m$1\033[0m"
  echo -e "$1" >> "$LOG_FILE"
}

log_result() {
  echo -e "$1" >> "$LOG_FILE"
}

test_route() {
  local method=$1
  local route=$2
  local data=$3
  local expected_status=$4
  local description=$5

  print_message "Testing: $description"
  echo -e "\033[1;33mCalling: $method $BASE_URL$route\033[0m"
  log_result "Calling: $method $BASE_URL$route"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$route")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$route" -H "Content-Type: application/json" -d "$data")
  fi

  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "\033[1;32mSuccess: Route $route returned code $expected_status\033[0m"
    log_result "Success: Route $route returned code $expected_status"
  else
    echo -e "\033[1;31mError: Route $route returned code $http_code (expected $expected_status)\033[0m"
    echo -e "Error Message: $body"
    log_result "Error: Route $route returned code $http_code (expected $expected_status)"
    log_result "Error Message: $body"
  fi
}


test_route "GET" "/users" "" 200 "Get all users"
test_route "GET" "/users/wallet/0xUserWalletAddress1" "" 200 "Get user with valid wallet address"
test_route "GET" "/users/wallet/0x" "" 400 "Get user with non-existent wallet address"
test_route "GET" "/users/id/invalidId" "" 400 "Get user with invalid ID"
test_route "GET" "/users/id/1" "" 200 "Get user with valid id "
test_route "GET" "/users/id/999" "" 404 "Get user with non-existent ID"

test_route "GET" "/incomes" "" 200 "Get all incomes"
test_route "POST" "/incomes/" '{"userId": 1, "amount": 100, "description": "Salary"}' 201 "Generate income"
test_route "POST" "/incomes/" '{"userId": 999, "amount": 100, "description": "Salary"}' 404 "Generate income for non-existent user"
test_route "POST" "/incomes/" '{"amount": 100, "description": "Salary"}' 400 "Generate income with missing userId"

test_route "GET" "/groups" "" 200 "Get all groups"
test_route "POST" "/groups/" '{"name": "New Group", "userIds": [1]}' 201 "Create group"
test_route "POST" "/groups/" '{"name": "New Group", "userIds": [999]}' 400 "Create group with non-existent user"
test_route "POST" "/groups/" '{"name": "New Group"}' 400 "Create group with missing userIds"

test_route "POST" "/auth/login" '{"walletAddress": "0xUserWalletAddress1"}' 200 "User login"
test_route "POST" "/auth/login" '{"walletAddress": "0xInvalidWallet"}' 400 "Login with non-existent wallet"
#test_route "POST" "/auth/register" '{"walletAddress": "0xUserWalletAddress32, "email": "user1@example.com"}' 201 "User registration"
test_route "POST" "/auth/register" '{"walletAddress": "0xUserWalletAddress1", "email": "user1@example.com"}' 400 "Register existing user"
test_route "POST" "/auth/register" '{"walletAddress": "", "email": "user1@example.com"}' 400 "Register with empty wallet address"
test_route "POST" "/auth/register" '{"walletAddress": "0xUserWalletAddress2", "email": ""}' 400 "Register with empty email"

test_route "GET" "/expenses" "" 200 "Get all expenses"
test_route "POST" "/expenses" '{"description": "Groceries", "amount": 50, "groupId": 1, "userId": 1}' 201 "Generate expense"
test_route "POST" "/expenses" '{"description": "Groceries", "amount": 50, "groupId": 999, "userId": 1}' 404 "Generate expense for non-existent group"
test_route "POST" "/expenses" '{"description": "Groceries", "amount": 50, "groupId": 1, "userId": 999}' 404 "Generate expense for non-existent user"
test_route "POST" "/expenses" '{"amount": 50, "groupId": 1, "userId": 1}' 400 "Generate expense with missing description"


test_route "GET" "/groups/3/optimize-tx" "" 200 "Get optimized transactions for group 3"
print_message "Testing completed."
echo -e "\n\033[1;32mResults logged to $LOG_FILE\033[0m"