var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./../lib/config');
var labels = config.modelLabels;
var dataset = config.datasetIDs;

//var workorderSchema = new Schema({any: {}}, { bufferCommands: false });

var itemSchema = new Schema({
  line: {type: Number },
  product: {type: String },
  productDescription: {type: String },
  customerMixRef: {type: String },
  originName: {type: String },
  volumeUnit: {type: String },
  pourSoFar: {type: Number },
  thisLoad: {type: Number },
  totalOrdered: {type: Number },
  ceMarking: {type: String },
  cashSaleLine: {type: Number },
  cashSaleLineLineTotalTaxAmount: {type: Number },
  cashSaleLineLineTotal: {type: Number }
}, { strict: false, versionKey: false });

mongoose.model('Item', itemSchema);

var workorderSchema = new Schema({
  id: {type: String },
  works: {type: String },
  account: {type: Number },
  po: {type: String },
  contract: {type: String },
  callOff: {type: Number },
  ticketNumber: {type: String },
  addressDetail: {type: String },
  addressStreet: {type: String },
  addressPostalCode: {type: String },
  addressCity: {type: String },
  address: {type: String },
  location: [Number],
  completedAction: {type: String },
  status: {type: String },
  brand: {type: String },
  customerName: {type: String },
  vehicle: {type: String },
  exWorks:  {type: String },
  title: {type: String },
  workflowId: {type: String },
  assignee: {type: String },
  driver: {type: String },
  type: {type: String },
  subtype: {type: String },
  instructions: {type: String },
  summary: {type: String },
  thisLoad: {type: Number },
  pourSoFar: {type: Number },
  totalOrdered: {type: Number },
  volumeUnit: {type: String },
  paymentGoods: {type: Number },
  vatPercentage: {type: Number },
  paymentAmount: {type: Number },
  haulier: {type: Number },
  haulierName: {type: String },
  dateOnSitePlanned: {type: Date },
  dateOnSiteEstimated: {type: Date },
  dateLeaveWBActual: {type: Date },
  despatchedBy: {type: String },
  addedWater: {type: Number },
  returnedMaterial: {type: Number },
  waitingTime: {type: Number },
  arrivalLocation: [Number],
  timeOnSite: {type: Date },
  dischargeLocation: [Number],
  dischargeStartTime: {type: Date },
  dischargeEndTime: {type: Date },
  timeOffSite: {type: Date },
  hotWaterAdded: {type: Boolean },
  chargesInvoiced: {type: Boolean },
  emailAddressForInvoice: {type: String },
  onBehalf: {type: String },
  vatRegNo: {type: String},
  siteContactName: {type: String},
  siteContactPhone: {type: String},
  radialMiles: {type: Number },
  companyNumber: {type: Number },
  productType: {type: String, enum: ['readymix', 'other', 'unknown'] },
  grossWeight: {type: Number },
  tareWeight: {type: Number },
  nettWeight: {type: Number },
  reasonReturnedMaterial: {type: String },
  aborted: {type: Boolean },
  abortTime: {type: Date },
  abortReason: {type: String },
  items: {
    type: [itemSchema]
  }
},{ timestamps: true, strict: false, versionKey: false  });

workorderSchema.index({
  id: 1
});

module.exports = function(db) {
  var model = db.model(dataset.WORKORDERS, workorderSchema, dataset.WORKORDERS);
  return model;
};