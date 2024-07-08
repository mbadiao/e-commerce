import Notification from "../Models/notifications.js";
import asyncHandler from "express-async-handler";

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id });
    res.json(notifications);
    });

const addNotification = asyncHandler(async ({user,message}) => {
    const notification = new Notification({
        user,
        message,
    });

    await notification.save();
}
);

export { getNotifications, addNotification };