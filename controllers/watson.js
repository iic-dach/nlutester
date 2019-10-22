const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const config = require('../config');
const { setSelection, buildFeatureRequest } = require('../utils/helpers');

const nlu = new NaturalLanguageUnderstandingV1({
  version: config.watson.nlunderstanding.version,
  authenticator: new IamAuthenticator({
    apikey: config.watson.nlunderstanding.iam_apikey
  }),
  url: config.watson.nlunderstanding.url
})

// fixed values for rendered page
const features = ["categories", "concepts","emotion", "entities", 
    "keywords", "metadata", "relations", "semantic_roles" ];
const inputTypes = ["url", "text"];

let model = {
  label: '',
  ids: [''],
  selected: false,
  entities: false,
  relations: false
}

exports.getIndex = (req, res, next) => {
  let result = '';
  let bodyText = '';
  model.selected = false;
  model.entities = false;
  model.relations = false;
  res.render('index', {
    result: result,
    bodyText: bodyText,
    features: features,
    inputTypes: inputTypes,
    fselected: setSelection(features, features[3]),
    iselected: setSelection(inputTypes, inputTypes[1]),
    model: model
  });
};

exports.getNluModel = (req, res, next) => {
  nlu.listModels()
    .then(response => {
      console.log(JSON.stringify(response, null, 2));
      if (response.result.models.length > 0) {
        model.label = 'Model: '
        model.ids[0] = response.result.models[0].model_id;
        console.log(model.ids[0]);
        res.send({modelId: model.ids[0]});
      } else {
        console.log("no model deployed to service");
        res.send({text: "no model deployed to service"});
      }   
    })
    .catch(err => {
      console.log('error:', err.message);
      res.status(200).send({text: "checkModel(): " + err.message});
    });
};

exports.postNlu = (req, res, next) => {
  if (!req.body.inputType || !req.body.body || !req.body.features) {
    res.status(400).send("All fields required!");
    return;
  }
  const bodyText = req.body.body;
  let receivedFeatures;
  model.selected = false;
  model.entities = false;
  model.relations = false;
  if (req.body.mlModel) {
    model.selected = true;
    if (req.body.mlEntities) {
      model.entities = true;
    }
    if (req.body.mlRelations) {
      model.relations = true;
    }
  } 
  if (Array.isArray(req.body.features)) {
    receivedFeatures = req.body.features;
  } else {
    receivedFeatures = req.body.features.split(',');
  }
  reqFeatures = buildFeatureRequest(receivedFeatures, model);
  const parameters = {
    [req.body.inputType]: bodyText,
    features: reqFeatures.features
  }
  nlu.analyze(parameters)
    .then(response => {
      result = JSON.stringify(response.result, null, 2);
      res.status(200).render("index",{
        result: result,
        bodyText: bodyText,
        inputTypes: inputTypes,
        features: features,
        fselected: setSelection(features, req.body.features),
        iselected: setSelection(inputTypes, req.body.inputType),
        model: model
      });
    })
    .catch(err => {
      result = JSON.stringify(err, null, 2);
      res.status(200).render("index",{
        result: result,
        bodyText: bodyText,
        inputTypes: inputTypes,
        features: features,
        fselected: setSelection(features, req.body.features),
        iselected: setSelection(inputTypes, req.body.inputType),
        model: model
      });
    });
};