"""
Some nonsense code to demonstrate PyFix.
Setup NVDA to read indentation:

1. press NVDAKey+n \ preferences \ settings
2. goto "document formatting" and set line indetation to speech or tones, your preference
Now read the following line-by-line and hear indentation.
Past this into PyFix and read the output. Indentation is preserved, but if you were to remove the indentation from the resulting code, you'd still be able to understand the intent because block endings are clearly marked with comments of the form "#end while", #end if" etc.
"""

v1 = 7
v2 = 14

def f (x):
	return 77
	

def g(y):
	while True:
		print ("this will never end.")
		
	return "never"



def another ():
	while not(done):
		count += 1

