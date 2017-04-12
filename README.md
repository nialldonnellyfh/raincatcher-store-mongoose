### raincatcher-mongoose-store


One stop shop for all Mongoose schemas 

### Run tests

Ensure Mongo is running on your machine, type the following command

```bash
npm test
```

### Models

Mongoose models can be found in `models` directory. To add a new model use the same naming convention for desired dataset. ie. `workorders` model for `workorders` dataset / collection. Then require the directory and access the model using the name applied.

### API

#### connect

To connect to mongo

```javascript
Connector.connect('mongodb://mongoUriGoseHere:27017/db', {})
  .then(function(db) {
    // has connection object
  }, function(error) {
    // handle error
  });
```

#### getDAL

Get the Data access layer object for a collection/dataset.

```javascript
Connector.getDataAccessLayer(collectionName, Model).
  then(function(_dal) {
    // do stuff with collection dal
  }, function(error) {
    // handle error
  });
```

#### disconnect

```javascript
Connector.disconnect()
  .then(function() {
    // disconnected
  }, function(error) {
    // something went wrong
  });
```
