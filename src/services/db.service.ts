import { User } from '../models/User';
import { CreditHistory } from '../models/CreditHistory';
import { SavedItem } from '../models/SavedItem';
import { connectDB } from '../config/db';

// Initialize database connection
connectDB();

export const dbService = {
  // User operations
  async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  },

  async getUserById(id: string) {
    return await User.findById(id);
  },

  async getUserByEmail(email: string) {
    return await User.findOne({ email });
  },

  async updateUser(id: string, updateData: any) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  },

  // Credit operations
  async updateUserCredits(userId: string, amount: number) {
    return await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true }
    );
  },

  async addCreditHistory(userId: string, amount: number, reason: string) {
    const creditHistory = new CreditHistory({
      userId,
      amount,
      reason,
    });
    return await creditHistory.save();
  },

  async getCreditHistory(userId: string) {
    return await CreditHistory.find({ userId }).sort({ timestamp: -1 });
  },

  // Saved items operations
  async saveItem(userId: string, itemData: any) {
    const savedItem = new SavedItem({
      userId,
      ...itemData,
    });
    return await savedItem.save();
  },

  async getSavedItems(userId: string) {
    return await SavedItem.find({ userId }).sort({ savedAt: -1 });
  },

  async removeSavedItem(userId: string, itemId: string) {
    return await SavedItem.findOneAndDelete({ userId, _id: itemId });
  },

  // Admin operations
  async getAllUsers() {
    return await User.find().select('-password');
  },

  async getUserStats() {
    const totalUsers = await User.countDocuments();
    const completedProfiles = await User.countDocuments({ profileCompleted: true });
    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$credits' } } }
    ]);

    return {
      totalUsers,
      completedProfiles,
      totalCredits: totalCredits[0]?.total || 0,
    };
  },
};