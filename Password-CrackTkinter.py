import hashlib
import tkinter as tk
from tkinter import font

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
    hashed_password_label.config(text="Hashed password: {}".format(hash_value))

# Create the main window
root = tk.Tk()
root.title("Password Checker")
root.geometry("400x250")
root.configure(bg='#f2f2f2')

# Create a label for password input
password_label = tk.Label(root, text="Enter Password:", font=("Helvetica", 14), bg='#f2f2f2')

# Create an entry field for password input
password_entry = tk.Entry(root, show='*', font=("Helvetica", 14), width=25)

# Create a button to check the password
check_button = tk.Button(root, text="Check Password", font=("Helvetica", 14), command=check_password, bg='#4CAF50', fg='#ffffff', activebackground='#3e8e41', activeforeground='#ffffff', bd=0, padx=20, pady=10, highlightthickness=0)
check_button.config(borderwidth=1, relief="solid", highlightbackground='#ffffff', highlightcolor='#ffffff')
check_button.config(bg='green', fg='black')

# Create a label to display the result
result_label = tk.Label(root, text="", font=("Helvetica", 14), bg='#f2f2f2', fg='#008080')

# Create a label to display the hashed password
hashed_password_label = tk.Label(root, text="", font=("Helvetica", 14), bg='#f2f2f2', fg='#008080')

# Pack the widgets into the window
password_label.pack(pady=10)
password_entry.pack(pady=5)
check_button.pack(pady=15)
result_label.pack(pady=10)
hashed_password_label.pack(pady=5)

# Start the main event loop
root.mainloop()
