import hashlib
import tkinter as tk

# Name of the file containing the passwords
password_file_name = "rockyou.txt"

def md5_hash(password):
    return hashlib.md5(password.encode()).hexdigest()

def crack_password(hash_value, password_list):
    for password in password_list:
        if md5_hash(password) == hash_value:
            return password
    return None

def check_password():
    # Get the password from the user
    password = password_entry.get()

    # Hash the password
    hash_value = md5_hash(password)

    # Crack the password
    password_list = open(password_file_name, "r", encoding='utf-8', errors='ignore').readlines()
    password_list = list(map(str.strip, password_list))
    cracked_password = crack_password(hash_value, password_list)

    # Display the result
    if cracked_password:
        result_label.config(text="Password is: {}".format(cracked_password))
    else:
        result_label.config(text="Password not found.")
    
    # Display the hashed password
    hashed_password_label.config(text="Hashed password is: {}".format(hash_value))

# create the main window
root = tk.Tk()
root.title("Password Checker")

# create a label for password input
password_label = tk.Label(root, text="Enter Password:")

# create an entry field for password input
password_entry = tk.Entry(root, show='*')

# create a button to check the password
check_button = tk.Button(root, text="Check Password", command=check_password)

# create a label to display the result
result_label = tk.Label(root, text="")

# create a label to display the hashed password
hashed_password_label = tk.Label(root, text="")

# pack the widgets into the window
password_label.pack(pady=10)
password_entry.pack(pady=5)
check_button.pack(pady=5)
result_label.pack(pady=10)
hashed_password_label.pack(pady=5)

# start the main event loop
root.mainloop()
