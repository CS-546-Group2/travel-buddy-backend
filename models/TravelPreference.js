import mongoose from 'mongoose';

const TravelPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travelStyle: { type: String, required: true },
  budgetRange: { type: String, required: true },
  accommodationStyle: { type: String, required: true },
  interests: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('TravelPreference', TravelPreferenceSchema);
