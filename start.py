import subprocess
import os
import json


# ======================================== Setup ========================================
def run_command(command, cwd=None, shell=False):
    try:
        subprocess.run(command, cwd=cwd, shell=shell, check=True, env=os.environ)
        print(f"Command succeeded: {' '.join(command)}")
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {' '.join(command)}")
        print(e)
        exit(-1)
    except FileNotFoundError as e:
        print(f"File not found: {command[0]}")
        print(e)
        exit(-1)

contract_path = "blockchain/build/contracts/AcademicResources.json"

if not os.path.exists(contract_path):
    print("Please run 'truffle compile' from blockchain directory and try this again!")
    exit(-1)


# ======================================== ABI ========================================
with open(contract_path, "r") as file:
    contract_data = json.load(file)

contract_abi = contract_data.get("abi")

abi_as_json_string = json.dumps(contract_abi)


# ======================================== .env ========================================
env_path = "backend/.env"
with open(env_path, "r") as env_file:
    env_content = env_file.read()

env_lines = env_content.splitlines()
updated_env_lines = []
abi_key_found = False

for line in env_lines:
    if line.startswith("ABI="):
        updated_env_lines.append(f"ABI={abi_as_json_string}")
        abi_key_found = True
    else:
        updated_env_lines.append(line)

if not abi_key_found:
    updated_env_lines.append(f"ABI={abi_as_json_string}")

with open(env_path, "w") as env_file:
    env_file.write("\n".join(updated_env_lines))


# ======================================== Run Servers ========================================
run_command(["C://Program Files//nodejs//node.exe", "C://Users//tadhg//Desktop//Codes//Gauri//CS4207-project//backend//server.js"], cwd="backend")
print("Backend server started.")

# subprocess.Popen(["C://Program Files//nodejs//npm.cmd", "install", "-g", "http-server"], cwd="backend")
