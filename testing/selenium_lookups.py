from selenium import webdriver  
import time  
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select 
options = webdriver.ChromeOptions()
#options.add_argument("headless") 


driver = webdriver.Chrome(executable_path='C:/Program Files (x86)/Google/Chrome/Application/chromedriver', options=options)

driver.maximize_window()  

driver.get("http://52.14.159.206/")  
driver.find_element_by_id("usernameInput").send_keys("username")  
driver.find_element_by_id("passwordInput").send_keys("password") 
driver.find_element_by_xpath("//button[text()='Sign In']").click()
time.sleep(1)   
driver.get("http://52.14.159.206/admin/lookups")   
 
driver.execute_script("const msg = alert('Testing Lookups'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()     
driver.execute_script("const msg = alert('Testing Add'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()   
driver.find_elements_by_xpath("//button[text()='Add']")[0].click()
time.sleep(2)
driver.find_element_by_class_name("form-control").send_keys("selenium_test_entry0")
driver.find_element_by_xpath("//button[text()='Save Changes']").click()
time.sleep(1)
driver.find_elements_by_xpath("//button[text()='Add']")[0].click()
time.sleep(1)
driver.find_element_by_class_name("form-control").send_keys("selenium_test_entry1")
time.sleep(1)
driver.find_element_by_xpath("//button[text()='Save Changes']").click()
time.sleep(2)
driver.execute_script("const msg = alert('Add Test Completed'); document.body.setAttribute('data-id', msg)")
time.sleep(2)
driver.switch_to.alert.accept()
time.sleep(2)
driver.execute_script("const msg = alert('Testing Delete'); document.body.setAttribute('data-id', msg)")
time.sleep(2)
driver.switch_to.alert.accept()
time.sleep(2)
driver.find_element_by_xpath(".//li[text() = 'selenium_test_entry0']").click()
time.sleep(1)
driver.find_element_by_xpath(".//li[text() = 'selenium_test_entry1']").click()
time.sleep(1)
driver.find_elements_by_xpath("//button[text()='Delete']")[0].click()
time.sleep(1)
driver.find_element_by_xpath("//button[text()='Save Changes']").click()
time.sleep(2)
driver.execute_script("const msg = alert('Delete Test Complete'); document.body.setAttribute('data-id', msg)")
time.sleep(2)
driver.switch_to.alert.accept() 
  

#driver.close()  
print("sign in test passed") 
