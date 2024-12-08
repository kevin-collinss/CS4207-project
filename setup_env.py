import json

# ======================================== Paths ========================================
CONTRACT_PATH = "blockchain/build/contracts/AcademicResources.json"
ENV_PATH = "backend/.env"

# ======================================== Load Contract Data ========================================
with open(CONTRACT_PATH, "r") as file:
    contract_data = json.load(file)

# Extract ABI
contract_abi = contract_data.get("abi")
abi_as_json_string = json.dumps(contract_abi)

# Extract Contract Address
networks = contract_data.get("networks", {})
if networks:
    # Get the first available network ID
    network_id, network_data = next(iter(networks.items()))
    CONTRACT_ADDRESS = network_data.get("address", "")
else:
    CONTRACT_ADDRESS = ""

# ======================================== Update .env File ========================================
with open(ENV_PATH, "r") as env_file:
    env_content = env_file.read()

env_lines = env_content.splitlines()
updated_env_lines = []
ABI_KEY_FOUND = False
ADDRESS_KEY_FOUND = False

for line in env_lines:
    if line.startswith("ABI="):
        updated_env_lines.append(f"ABI={abi_as_json_string}")
        ABI_KEY_FOUND = True
    elif line.startswith("CONTRACT_ADDRESS="):
        updated_env_lines.append(f"CONTRACT_ADDRESS={CONTRACT_ADDRESS}")
        ADDRESS_KEY_FOUND = True
    else:
        updated_env_lines.append(line)

# Append missing keys if not found
if not ABI_KEY_FOUND:
    updated_env_lines.append(f"ABI={abi_as_json_string}")
if not ADDRESS_KEY_FOUND:
    updated_env_lines.append(f"CONTRACT_ADDRESS={CONTRACT_ADDRESS}")

with open(ENV_PATH, "w") as env_file:
    env_file.write("\n".join(updated_env_lines))

# ======================================== Feedback ========================================
if CONTRACT_ADDRESS:
    print(f"Contract address ({CONTRACT_ADDRESS}) have been written to .env.")
else:
    print("Contract address not found. Check your deployment or artifact file.")

if ABI_KEY_FOUND:
    print("ABI have been written to .env.")
else:
    print("Error writing ABI to .env file")
