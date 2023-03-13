import hashlib

# Name of the file containing the passwords
password_file_name = "rockyou.txt"

def md5_hash(password):
    return hashlib.md5(password.encode()).hexdigest()

def crack_password(hash_value, password_list):
    for password in password_list:
        if md5_hash(password) == hash_value:
            return password
    return None

# Get the password from the user
password = input("Enter password to hash and crack: ")

# Hash the password
hash_value = md5_hash(password)

# Print the hash value
print("Hash value of password: {}".format(hash_value))

# Crack the password
print("Cracking password...")
password_list = open(password_file_name, "r", encoding='utf-8', errors='ignore').readlines()
password_list = list(map(str.strip, password_list))
cracked_password = crack_password(hash_value, password_list)

if cracked_password:
    print("Password is: {}".format(cracked_password))
else:
    print("Password not found.")