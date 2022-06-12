from selenium import webdriver  
import time  
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select 
options = webdriver.ChromeOptions()
#options.add_argument("headless") 


driver = webdriver.Chrome(executable_path='C:/Program Files (x86)/Google/Chrome/Application/chromedriver', options=options)

driver.maximize_window()  

driver.get("http://52.14.159.206/")  
 
driver.execute_script("const msg = alert('Testing Sign In'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()   

driver.find_element_by_id("usernameInput").send_keys("username")  
time.sleep(1)  
driver.find_element_by_id("passwordInput").send_keys("password") 
  

driver.find_element_by_xpath("//button[text()='Sign In']").click()
time.sleep(1)    

driver.execute_script("const msg = alert('Sign Up Testing Complete'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()   

driver.execute_script("const msg = alert('Testing Draft Post'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()   

driver.find_element_by_xpath("//a[text()='Draft Post']").click()
time.sleep(1)    
driver.find_element_by_class_name("form-control").send_keys("test case 1")
time.sleep(1)    
driver.find_element_by_class_name("form-select")


select = Select(driver.find_element_by_class_name("form-select"))
select.select_by_visible_text("CSP LL Social Events")

time.sleep(1)
driver.find_element_by_xpath("//p").send_keys("test case 1")

time.sleep(1)

driver.find_element_by_xpath("//button[text()='Post']").click()
time.sleep(1)
driver.find_element_by_xpath("//button[text()='Close']").click()
time.sleep(1)
driver.find_elements_by_xpath("//a[text()='Read more']")[0].click()


driver.execute_script("const msg = alert('Draft Post Testing Complete'); document.body.setAttribute('data-id', msg)")
time.sleep(3)
driver.switch_to.alert.accept()   

#driver.close()  
print("sign in test passed") 
