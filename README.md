# jumga
The online market backend system https://jumga-store.web.app/

### Run the project locally
> Run the switch_env.sh script

> cd functions && npm install

> npm run emulator

### Create a function
> create a file in any of the current folders in the src folder and end the file with .f.ts

### The Payment System
> The payment system utilizes flutterwave standard payment

> payment system is handled in two files, the src/flutterwave/processPayment.f.ts && src/flutterwave/acceptPayment.f.ts

### Process Payment
###### file - (src/flutterwave/processPayment.f.ts)
> The processPayment handles payment of both the store before approval and for any item to be purchased

> It takes in details respective to the type of purchase, either for store-approval or for purchase of item

> The details includes a currency value which is generated at frontend from an api that determines the user's geolocation

> The currency is compared to the US Dollars and a value is determined for the user to pay

###### payment for store-approval
> payment details such as the email, name and currency of the user is gotten

> The payment system then retrieves the price of $20 and compare it to the currency receieved

> For instance, If NGN is the currency retrieved, then it converts $20 to fit the NGN currency value

> For instance, If USD is the currency retrieved, then it returns $20 as payment price

> A temporary database of paymentRef is kept to track payment

> This paymentRef created is deleted in 2days

> If payment is made then, the store is approved and the specific paymentRef is deleted

###### payment for items
> Payment details such as the email, name, currency of the user is gotten

> The payment system then retrieve goods respective to the email from the database and calculate total cost in dollars

> The payment system then compares and convert this cost to users currency and create a payment link

> The payment system creates a paymentRef to track payment for specific cart


### Accept Payment
###### file - (src/flutterwave/acceptPayment.f.ts)
> The acceptPayment function accepts payment made for both store-approval and purchaes of item

> It receieves it values from flutterwave webhooks

###### accept payment for store-approval
> The payment system accept values from flutterwave webhook

> It finds paymentRef related to the paymentRef value returned

> It makes store approved

###### accept payment for items
> THe payment system accept values from flutterwave webhook

> It finds paymentRef related to the paymentRef value returned

> It calculates commissions on sales and commission on delivery and add them to values of cart

> Creates an Order with these values



### View Values After Payment
> You can view the values of each payment for items at https://jumga-store.web.app/admin

> Your login details should be email - admin@gmail.com, password - 12345hb

