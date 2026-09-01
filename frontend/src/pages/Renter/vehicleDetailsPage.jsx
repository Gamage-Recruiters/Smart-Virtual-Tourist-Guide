import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Heart,
  Shield,
  Snowflake,
  Navigation,
  Briefcase,
  BatteryCharging,
  Bluetooth,
} from "lucide-react";
import { VehicleOverview } from "../../components/Renter/vehicleOverview";
import { BookingCard } from "../../components/Renter/bookingCard";
import { SupportCard } from "../../components/Renter/supportCard";
import {
  AmenityCard,
  InsurancePolicyItem,
} from "../../components/Renter/amenityCard";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

export default function VehicleDetailsPage() {
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  // console.log(vehicle);

  const amenities = [
    { icon: Snowflake, label: "Air Conditioning" },
    { icon: Navigation, label: "GPS Navigation" },
    { icon: Bluetooth, label: "Bluetooth" },
    { icon: Briefcase, label: "Large Luggage Space" },
    { icon: BatteryCharging, label: "USB Charging" },
    { icon: Shield, label: "Safety Airbags" },
  ];

  const insurancePolicies = [
    {
      title: "Collision Damage Waiver",
      description: "Full coverage for vehicle damage",
    },
    {
      title: "Theft Protection",
      description: "Complete theft coverage included",
    },
    {
      title: "24/7 Roadside Assistance",
      description: "Emergency support anytime, anywhere",
    },
    {
      title: "Third-Party Liability",
      description: "Full legal protection included",
    },
  ];

  const [activeImage, setActiveImage] = useState(vehicle?.image[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans ">
      {/* Breadcrumbs */}
      <nav className="text-xs font-semibold text-slate-400 flex gap-2 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="hover:text-slate-600 cursor-pointer"
        >
          Dashboard
        </button>
        <span>&gt;</span>
        <button
          onClick={() => navigate("/rent-vehicle")}
          className="hover:text-slate-600 cursor-pointer"
        >
          Rent vehicle
        </button>
        <span>&gt;</span>
        <span className="text-slate-600">Rent vehicle Details</span>
      </nav>

      {/* Title & Header Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {vehicle?.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Stack spacing={1}>
                <Rating
                  name="half-rating-read"
                  defaultValue={Number(vehicle?.rating) || 0}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </Stack>
              <span className="text-xs font-bold text-slate-600 ml-1">
                ({vehicle?.rating || "0.0"} - 127 reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
              <MapPin size={14} className="text-blue-600" />
              Available in Colombo, Kandy, Galle
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-3 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Heart
            size={20}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
            }
          />
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Media & Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Visual Showcase */}
          <div className="bg-white p-4 rounded-4xl shadow-sm border border-slate-100 space-y-4">
            {/* Main Feature Image Display */}
            <div className="h-100 w-full rounded-2xl overflow-hidden shadow-inner">
              <img
                src={activeImage}
                alt={vehicle?.name || "Vehicle Showcase"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Updated Thumbnail Container: Fixed to single-row horizontal scrolling */}
            <div className="w-full overflow-hidden">
              <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x">
                {vehicle?.image.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-24 w-28 shrink-0 snap-start rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Overview Component */}
          <VehicleOverview
            transmission={vehicle?.transmission}
            fuelType={vehicle?.fuelType}
            seats={vehicle?.seats}
            year={vehicle?.year}
          />

          {/* Amenity Card */}
          <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((item, index) => (
                <AmenityCard key={index} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>

          <div
            className={`bg-white p-8 rounded-4xl shadow-sm border border-slate-100 ${vehicle?.fullInsurance ? "" : "hidden"}`}
          >
            {/* Insurance Header */}
            <div className="flex gap-4 items-start mb-8">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Full Insurance Included
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Drive with complete peace of mind - comprehensive coverage at
                  no extra cost
                </p>
              </div>
            </div>

            {/* Insurance Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
              {insurancePolicies.map((policy, index) => (
                <InsurancePolicyItem
                  key={index}
                  title={policy.title}
                  description={policy.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Booking Form & Support */}
        <div className="space-y-6">
          <BookingCard price={vehicle?.price} />
          <SupportCard />
        </div>
      </div>
    </div>
  );
}
