import json

# ======================================== Paths ========================================
contract_path = "blockchain/build/contracts/AcademicResources.json"
env_path = "backend/.env"

# ======================================== Load Contract Data ========================================
with open(contract_path, "r") as file:
    contract_data = json.load(file)

# Extract ABI
contract_abi = contract_data.get("abi")
abi_as_json_string = json.dumps(contract_abi)

# Extract Contract Address
networks = contract_data.get("networks", {})
if networks:
    # Get the first available network ID
    network_id, network_data = next(iter(networks.items()))
    contract_address = network_data.get("address", "")
else:
    contract_address = ""

# ======================================== Update .env File ========================================
with open(env_path, "r") as env_file:
    env_content = env_file.read()

env_lines = env_content.splitlines()
updated_env_lines = []
abi_key_found = False
address_key_found = False

for line in env_lines:
    if line.startswith("ABI="):
        updated_env_lines.append(f"ABI={abi_as_json_string}")
        abi_key_found = True
    elif line.startswith("CONTRACT_ADDRESS="):
        updated_env_lines.append(f"CONTRACT_ADDRESS={contract_address}")
        address_key_found = True
    else:
        updated_env_lines.append(line)

# Append missing keys if not found
if not abi_key_found:
    updated_env_lines.append(f"ABI={abi_as_json_string}")
if not address_key_found:
    updated_env_lines.append(f"CONTRACT_ADDRESS={contract_address}")

with open(env_path, "w") as env_file:
    env_file.write("\n".join(updated_env_lines))

# ======================================== Feedback ========================================
if contract_address:
    print(f"Contract address ({contract_address}) have been written to .env.")
else:
    print("Contract address not found. Check your deployment or artifact file.")

if abi_key_found:
    print(f"ABI have been written to .env.")
else:
    print("Error writing ABI to .env file")
