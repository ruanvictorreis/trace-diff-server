def is_prime_number(n):
  if n == 1:
    return(False)
  else:
    for i in range(2, n):
      if n % i == 0:
        return(False)
    return(True)

assert is_prime_number(2) == True, '>>> is_prime_number(2)\n    # Error: expected\n    #     True\n    # but got\n    #     %s' % is_prime_number(2)
assert is_prime_number(3) == True, '>>> is_prime_number(3)\n    # Error: expected\n    #     True\n    # but got\n    #     %s' % is_prime_number(3)
assert is_prime_number(4) == False, '>>> is_prime_number(4)\n    # Error: expected\n    #     False\n    # but got\n    #     %s' % is_prime_number(4)
assert is_prime_number(7) == True, '>>> is_prime_number(7)\n    # Error: expected\n    #     True\n    # but got\n    #     %s' % is_prime_number(7)
assert is_prime_number(9) == False, '>>> is_prime_number(9)\n    # Error: expected\n    #     False\n    # but got\n    #     %s' % is_prime_number(9)
assert is_prime_number(12) == False, '>>> is_prime_number(12)\n    # Error: expected\n    #     False\n    # but got\n    #     %s' % is_prime_number(12)
assert is_prime_number(13) == True, '>>> is_prime_number(13)\n    # Error: expected\n    #     True\n    # but got\n    #     %s' % is_prime_number(13)
assert is_prime_number(15) == False, '>>> is_prime_number(15)\n    # Error: expected\n    #     False\n    # but got\n    #     %s' % is_prime_number(15)
assert is_prime_number(1) == False, '>>> is_prime_number(1)\n    # Error: expected\n    #     False\n    # but got\n    #     %s' % is_prime_number(1)