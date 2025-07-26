const mongoose = require('mongoose');

const Room = require("./../models/roomModel");
const User = require("../models/userModel");

module.exports.createRoom = async (req, res, next) => {
    try {
        const { roomTitle, roomDescription } = req.body;

        // Check if the requesting user exists
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Requesting user is not a valid user",
                success: false
            });
        }

        // Create member object for the board
        const members = [{
            memberId: req.userId,
            memberRole: 'OWNER',
            lastAccessedAt: null,
        }];

        // Create the board
        const room = await room.create({
            roomTitle,
            roomDescription,
            members
        });

        console.log(`room created with details: ${room}`);
        res.status(201).json({ message: "Room created successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports.createRoomWithMembers = async (req, res, next) => {
    try {
        const { roomTitle, roomDescription, members } = req.body;

        console.log(members);
        
        let memberObj = []
        
        members.forEach((member) => {
            memberObj.push({
                memberId: member.memberId,
                memberRole: member.role,
                lastAccessedAt: null
            })
        })

        console.log(memberObj);

        // Create the room
        const room = await Room.create({
            roomTitle,
            roomDescription,
            members: memberObj
        });

        console.log(`Room created with details: ${room}`);
        res.status(201).json({ message: "Room created successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports.JoinUserToRoom = async (req, res, next) => {
    try {
        const { roomId, userId, role } = req.body;

        const [room, user] = await Promise.all([
            Room.findById(roomId),
            User.findById(userId)
        ]);

        if (!room || !user) {
            return res.status(404).json({
                message: "Passed roomID or userId is invalid",
                success: false
            });
        }

        const isAlreadyMapped = room.members.some(member => member.memberId.equals(userId));

        console.log(`isAlreadyMapped : ${isAlreadyMapped}`);
        if (isAlreadyMapped) {
            return res.status(202).json({
                message: "User is already mapped with room",
                success: true
            });
        }

        room.members.push({
            memberId: userId,
            memberRole: role.toUpperCase(),
            lastAccessedAt: null,
        });

        console.log(room.members);

        const updatedRoom = await Room.findByIdAndUpdate(room._id, room, { new: true });

        console.log(`updated room : ${updatedRoom}`);

        res.status(200).json({ message: "User mapped to room successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports.assignUserToRoom = async (req, res, next) => {
    try {
        const { roomId, userId, role } = req.body;

        console.log(`${roomId} ${userId} ${role}`);

        const [room, user] = await Promise.all([
            Room.findById(roomId),
            User.findById(userId)
        ]);

        if (!room || !user) {
            return res.status(404).json({
                message: "Passed roomID or userId is invalid",
                success: false
            });
        }

        const isAlreadyMapped = room.members.some(member => member.memberId.equals(user._id));

        console.log(`isAlreadyMapped : ${isAlreadyMapped}`);
        if (isAlreadyMapped) {
            return res.status(202).json({
                message: "User is already mapped with room",
                success: true
            });
        }

        room.members.push({
            memberId: userId,
            memberRole: role.toUpperCase(),
            lastAccessedAt: null,
        });

        console.log(room.members);

        const updatedRoom = await Room.findByIdAndUpdate(room._id, room, { new: true });

        console.log(`updated room : ${updatedRoom}`);

        res.status(200).json({ message: "User mapped to room successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Controller function to handle GET request for room details

module.exports.getRoomDetails = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({
                message: "Invalid roomId",
                success: false
            });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        }

        // Return room details in the response
        res.status(200).json({
            message: "Room details retrieved successfully",
            room,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports.removeUserFromRoom = async (req, res, next) => {
    try {
        const { roomId, userId } = req.body;

        console.log(`${roomId} ${userId}`);

        const [room, user] = await Promise.all([
            Room.findById(roomId),
            User.findById(userId)
        ]);

        if (!room || !user) {
            return res.status(404).json({
                message: "Passed roomId or userId is invalid",
                success: false
            });
        }

        const isAlreadyMapped = room.members.some(member => member.memberId.equals(user._id));

        console.log(`isAlreadyMapped : ${isAlreadyMapped}`);
        if (!isAlreadyMapped) {
            return res.status(202).json({
                message: "User is not mapped with room",
                success: true
            });
        }

        room.members = room.members.filter(member => !member.memberId.equals(user._id));
        console.log(room.members);

        const updatedRoom = await Room.findByIdAndUpdate(room._id, room, { new: true });
        console.log(`updated room : ${updatedRoom}`);

        res.status(200).json({ message: "User removed from room successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports.getRoomsForUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        console.log(`${userId}`);

        const [user] = await Promise.all([
            User.findById(userId)
        ]);

        if (!user) {
            return res.status(404).json({
                message: "Passed userId is invalid",
                success: false
            });
        }

        const rooms = await Room.find({ 'members.memberId': userId });
        console.log(rooms);

        const respRoom = [];
        rooms.forEach((room) => {
            const member = room.members.find(m => m.memberId.equals(userId));
            if (member) {
                respRoom.push({
                    ...room._doc,
                    role: member.memberRole,
                    lastAccessedAt: member.lastAccessedAt
                });
            }
        });

        res.status(200).json({
            message: "Rooms for user retrieved successfully",
            respRoom,
            roomCnt: respRoom.length,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports.deleteRoomById = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({
                message: "Invalid roomId",
                success: false
            });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        }

        const deletedRoom = await Room.findByIdAndDelete(roomId);
        console.log(`deletedRoom ${deletedRoom}`);

        // Return room details in the response
        res.status(200).json({
            message: "Room deleted successfully",
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
