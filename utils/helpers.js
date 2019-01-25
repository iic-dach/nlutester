
exports.setSelection = (items, selectedItems) => {
  const selection = [];
  items.forEach(f => {
    if (selectedItems.indexOf(f) > -1) {
      selection.push(true);
    } else {
      selection.push(false);
    }
  });
  return selection;
}

// Builds a Javascript Object from the request Data
exports.buildFeatureRequest = (features, model) => {  
  let reqFeatures = {
    features: {}
  };  
  features.forEach(f => {
    if (f === 'entities' || f === 'relations') {
      if (model[f]) {
        reqFeatures.features[f] = {
          model: model.ids[0]
        };
      } else {
        reqFeatures.features[f] = {};
      }
    } else {
      reqFeatures.features[f] = {};
    }
  });
  return reqFeatures;
};
