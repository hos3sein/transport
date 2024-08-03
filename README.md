# Transport Company service

This system for inquiry price

## install

```
npm install
```

## run project

```
npm run dev
```

```
SERVER : http://121.41.58.117:6011/api/v1/transport
LOCAL : http://localhost:6011/api/v1/transport
PORT : 6011
```

#

#

#

#

## Request Inquiry Price

## as BussinesMan

##### URL : inquiry/inquiryprice

#

##### Method : POST

#

| Parameter     | Type     | Description   |
| :------------ | :------- | :------------ |
| `quantity`    | `Number` | **Required**. |
| `destination` | `Obj`    | **Required**  |
| `origin`      | `Obj`    | **Required**  |
| `grade`       | `Number` | **required**. |
| `sales`       | `string` | **required**. |

### Offer price

## as Company

##### URL :inquiry/offrprice/:inquiryID/:price

##### Method : GET

##

#

### Inquiry Me

## as BusinessMan

##### URL : /inquiry/inquiryme

##### Method : GET

##

#

#

### all Inquiry

## as Company

##### URL : /inquiry/allinquiry

##### Method : GET

##

#

#

### Offer Me

## as Company

##### URL : /inquiry/offerme

##### Method : GET

##

#

#

## Approve Transport Company

## as BusinessMan

##### URL : /inquiry/approveoffer/:inquiryID/:UserIDComapnyTransport

#

##### Method : POST

#

| Parameter | Type     | Description              |
| :-------- | :------- | :----------------------- |
| `seller`  | `obj`    | **Required**,            |
| `price`   | `Number` | **Required** price sales |
