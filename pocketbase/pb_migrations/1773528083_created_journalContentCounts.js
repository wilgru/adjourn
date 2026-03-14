/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1407978968",
        "hidden": false,
        "id": "relation3249006413",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "journal",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "_clone_rHp7",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number3108440613",
        "max": null,
        "min": null,
        "name": "noteCount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number1787727622",
        "max": null,
        "min": null,
        "name": "taskCount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "number3444657378",
        "max": null,
        "min": null,
        "name": "updateCount",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_2337689436",
    "indexes": [],
    "listRule": null,
    "name": "journalContentCounts",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  j.id AS journal,\n  j.user AS user,\n  COUNT(DISTINCT n.id) AS noteCount,\n  COUNT(DISTINCT t.id) AS taskCount,\n  COUNT(DISTINCT u.id) AS updateCount\nFROM journals j\nLEFT JOIN notes n\n  ON n.journal = j.id\nLEFT JOIN tasks t\n  ON t.journal = j.id\nLEFT JOIN updates u\n  ON u.journal = j.id\nGROUP BY\n  j.id",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2337689436");

  return app.delete(collection);
})
