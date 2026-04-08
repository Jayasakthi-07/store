import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  telegramLink: string;
  instagramLink: string;
}

const SettingsSchema: Schema = new Schema({
  telegramLink: { type: String, default: '' },
  instagramLink: { type: String, default: '' },
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
