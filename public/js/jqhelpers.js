function documentReady() {
    $('#mlEntGroup').toggle(false);
    $('#mlRelGroup').toggle(false);
    checkFeatures();
    if (($("#modelLabel").text().indexOf("Model:") != 0) && ($("#modelLabel").text().indexOf("no model") != 0)) {
      $('#modelGroup').toggle(false);
      getModel();
    }
  };

function checkFeatures(){
  if($('div.checkbox-group.required :checkbox:checked').length == 0 ) {
    $('#submit').prop('disabled', true);
  } else {
    $('#submit').prop('disabled', false);
    checkModel();
  }
  if ($("#modelLabel").text().indexOf("Model:") == 0) {
    if($("#entities").is(':checked') || $("#relations").is(':checked')) {
      $('#modelGroup').toggle(true);
    } else {
      $('#modelGroup').toggle(false);
      $('#mlModel').prop("checked", false);
      $('#mlEntities').prop("checked", false);
      $('#mlRelations').prop("checked", false);
    }
  }
}

function checkModel (){
  if ($("#modelLabel").text().indexOf("Model:") === 0) {
    if($("#mlModel").is(':checked') && !$("#mlEntities").is(':checked') && !$("#mlRelations").is(':checked')) {
      $('#submit').prop('disabled', true);
    } else {
      $('#submit').prop('disabled', false);
    }
    if($("#mlModel").is(':checked') && $("#entities").is(':checked')) {
      $('#mlEntGroup').toggle(true);
    } else {
      $('#mlEntGroup').toggle(false);
      $('#mlEntities').prop("checked", false);
    }
    if($("#mlModel").is(':checked') && $("#relations").is(':checked')) {
      $('#mlRelGroup').toggle(true);
    } else {
      $('#mlRelGroup').toggle(false);
      $('#mlRelations').prop("checked", false);
    }
  } else {
    $('#modelGroup').toggle(false);
  }
}

function getModel() {
  $.get( "/getmodel", function( data ) {
    if (data.hasOwnProperty('modelId')) {
      $("#modelLabel").text("Model: " + data.modelId);
      $('#modelGroup').toggle(true);
    } else {
      $("#result").text(data.text);
    }
  });
}