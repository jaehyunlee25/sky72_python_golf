from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime
import time

print('step 1')
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('headless')
chrome_options.add_argument('window-size=1920x1080')
chrome_options.add_argument('disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument("--disable-web-security")
chrome_options.add_argument("--disable-site-isolation-trials")

print('step 2')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

print('1.0. javascript call')
f = open('crawler.js', 'r')
con = f.read()
f.close()

print('2.0. selenium start')
driver.get('http://www.sky72.com/kr/reservation/real_step01_search.jsp')
driver.implicitly_wait(3)
driver.execute_script(con)
time.sleep(5)

result = driver.find_element(By.ID, 'dateListId1')
print(result.get_attribute('innerHTML'))

driver.quit()
