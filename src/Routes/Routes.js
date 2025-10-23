import PriceManagement from "../Pages/PartManagement/PriceManagement/PriceManagement";
import PartPriceChecker from "../Pages/PartManagement/PriceManagement/PartPriceChecker";
import CouponManagement from "../Pages/Offer Management/CouponManagement/CouponManagement";
import CouponList from "../Pages/Offer Management/CouponManagement/CouponList";
import SliderManagement from "../Pages/Offer Management/Slider/SliderManagement";
import SliderList from "../Pages/Offer Management/Slider/SliderList";
import PromoManagement from "../Pages/Offer Management/Promo/PromoManagement";
import PromoList from "../Pages/Offer Management/Promo/PromoList";
import OfferManagement from "../Pages/Offer Management/Offer/OfferManagement";
import OfferList from "../Pages/Offer Management/Offer/OfferList";
import OfferPartsList from "../Pages/Offer Management/Offer/OfferPartsList";
import OfferPreview from "../Pages/Offer Management/Offer/OfferPreview";
import EmailConfiguration from "../Pages/Configurations/EmailConfiguration";
import ShippingConfiguration from "../Pages/Configurations/ShippingConfiguration";
import OrderManagement from "../Pages/Dashboard/OrderManagement/OrderManagement";
import GeneralConfiguration from "../Pages/Configurations/GeneralConfiguration";
import ShippingCompanies from "../Pages/Configurations/ShippingCompanies";
import OrderDetails from "../Pages/Dashboard/OrderManagement/OrderDetails";
import CustomerDetails from "../Pages/Dashboard/OrderManagement/CustomerDetails";
import OfferItems from "../Pages/Offer Management/Offer/OfferItems";
import HideParts from "../Pages/PartManagement/HideParts/HideParts";
import PartStock from "../Pages/PartManagement/PartStock/PartStock";
import DeliverModal from "../Pages/Dashboard/OrderManagement/DeliverModal";
import Departments from "../Pages/CategoryManagement/Departments";
import ShippingDimensions from "../Pages/Configurations/ShippingDimensions";
import SupplierManagement from "../Pages/SupplierManagement/SupplierManagement";
import SitemapManagement from "../Pages/Configurations/SitemapManagement";
import PartsDataByModel from "../Pages/DataManagement/PartsDataByModel";
import ModelManagement from "../Pages/Configurations/ModelManagement";
import ProductsManagement from "../Pages/DataManagement/ProductsManagement";
import ProductPositionsManagement from "../Pages/DataManagement/ProductPositionsManagement";
import PolicyManagement from "../Pages/Configurations/PolicyManagement";
import MakeManagement from "../Pages/Configurations/MakeManagement";
import OEDataManagement from "../Pages/DataManagement/OEDataManagement";
import UserManagement from "../Pages/Configurations/UserManagement";
import NewInvoice from "../Pages/Dashboard/OrderManagement/NewInvoice";
import NewParts from "../Pages/PartManagement/NewParts";
import UploadNewData from "../Pages/DataManagement/UploadNewData";

import NewPartsBufferZone from "../Pages/DataManagement/NewPartsBufferZone";
import VerifyNewParts from "../Pages/DataManagement/VerifyNewParts";
import PartMediaManagement from "../Pages/DataManagement/PartMediaManagement";
import NewPCDataTransfer from "../Pages/DataManagement/NewPCDataTransfer";
import PartsInformationUpdate from "../Pages/DataManagement/PartsInformationUpdate";
import PartsDataByModelUsed from "../Pages/DataManagement/PartsDataByModelUsed";

// routes.js
const routes = [
  { path: '/', element: <OrderManagement /> },
  { path: '/C', element: <DeliverModal /> },


 

 ////////////////////// Order Management's Routing ///////////////////////////
{ path: '/UserManagement', element : <UserManagement/>},
{ path: '/OrderManagement', element : <OrderManagement/>},
{ path: '/OrderDetails/:order_id?', element : <OrderDetails/>},
{ path: '/NewInvoice/:order_id?', element : <NewInvoice/>},
{ path: '/CustomerDetails/:customer_id?', element : <CustomerDetails/>},



////////////////////// Category Management's Routing ///////////////////////////
{ path: '/CategoryManagement', element : <Departments/>},



  ////////////////////// Programs's Routing ///////////////////////////
//  { path: '/Programs', element: <Programs /> },
 // { path: '/Programs/ProgramsWizardCourses/:master_program_id?', element: <ProgramsWizardCourses /> },
  //{ path: '/Programs/ProgramsWizardSubjects/:program_id?', element: <ProgramsWizardSubjects /> },
 

 ////////////////////// Part Management's Routing ///////////////////////////
 { path: '/PriceManagement', element: <PriceManagement /> },
 { path: '/PartPriceChecker', element: <PartPriceChecker /> },
 { path: '/HideParts', element: <HideParts /> },
 { path: '/PartsStock', element: <PartStock /> },


 ////////////////////// Coupon Management's Routing ///////////////////////////
{path : '/CouponManagement/:offer_coupon_id?' , element : <CouponManagement/>},
{path: '/CouponList', element: <CouponList/>},
  ////////////////////// Franchises's Routing ///////////////////////////

  
   ////////////////////// offers's Routing ///////////////////////////
   { path: '/SliderManagement/:slider_id?', element: <SliderManagement /> },
   { path: '/SliderList', element: <SliderList /> },
   
   { path: '/PromoManagement/:promo_id?', element: <PromoManagement /> },
   { path: '/PromoList', element: <PromoList /> },
   
   { path: '/OfferManagement/:offer_id?', element: <OfferManagement /> },
  
   { path: '/OfferList', element: <OfferList /> },
    { path: '/OfferPartsList/:offer_id?', element: <OfferPartsList /> },
   { path: '/OfferPreview/:offer_id?', element: <OfferPreview /> },
   { path: '/OfferItems/:offer_id?', element: <OfferItems /> },



////////////////////// Configuration's Routing //////////////////////////////////////
{ path: '/EmailConfiguration', element: <EmailConfiguration /> },
{ path: '/ShippingConfiguration', element: <ShippingConfiguration /> },
{ path: '/GeneralConfiguration', element: <GeneralConfiguration /> },
{ path: '/ShippingCompanies', element: <ShippingCompanies /> },
{ path: '/ShippingDimensions', element: <ShippingDimensions /> },
{ path: '/SitemapManagement', element: <SitemapManagement /> },
{ path: '/PageManagement', element: <PolicyManagement /> },


  
   
   /*    { path: '/ManageCourses/:offers_course_id?', element: <ManageCourses /> },
   { path: '/CoursesList', element: <CoursesList /> },
   { path: '/ManageSubjects/:offers_subject_id?', element: <ManageSubjects /> },
   { path: '/SubjectsList', element: <SubjectsList /> }, */



  // { path: '/Franchise/New', element: <ManageFranchise /> },
  // { path: '/Franchise/Update/:franchise_id', element: <ManageFranchise /> },
  // { path: '/Franchises/List', element: <FranchisesList /> },
  // { path: '/Franchise/Directors/:master_program_id?', element: <ManagePrograms /> },
  ////////////////////// Supplier Management's Routing ///////////////////////////
  { path: '/SupplierManagement', element: <SupplierManagement /> },
  ////////////////////// Data Management's Routing ///////////////////////////
  { path: '/PartsDataByModel', element: <PartsDataByModel /> },
  { path: '/PartsDataByModelUsed', element: <PartsDataByModelUsed /> },
  { path: '/ModelManagement', element: <ModelManagement /> },
  { path: '/MakeManagement', element: <MakeManagement /> },
  { path: '/ProductsManagement', element: <ProductsManagement /> },
  { path: '/ProductPositionsManagement', element: <ProductPositionsManagement /> },
  { path: '/OEDataManagement', element: <OEDataManagement /> },
  { path: '/NewParts', element: <NewParts /> },
  { path: '/UploadNewData', element: <UploadNewData /> },
  { path: '/NewPartsBufferZone', element: <NewPartsBufferZone /> },
  { path: '/VerifyNewParts', element: <VerifyNewParts /> },
  { path: '/PartMediaManagement', element: <PartMediaManagement /> },
  { path: '/PartsInformationUpdate', element: <PartsInformationUpdate /> },
  { path: '/NewPCDataTransfer', element: <NewPCDataTransfer /> },

];

export default routes;
