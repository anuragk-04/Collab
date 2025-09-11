import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const VoiceRoom = ({ channelName, appId, token, uid, onLeave }) => {
  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🔧 VoiceRoom Init Start");

        // 1️⃣ Get mic permissions
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("✅ Mic permission granted");

        // 2️⃣ Fetch token if not passed
        let agoraToken = token;
        if (!agoraToken) {
          console.log("Fetching Agora Token from backend...");
          const { data } = await axios.get(
            `http://localhost:5002/generate-agora-token?channelName=${channelName}`
          );
          agoraToken = data.token;
        }
        console.log("✅ Token ready:", agoraToken);

        // 3️⃣ Join channel
        console.log("Joining Agora Channel:", { appId, channelName, agoraToken });
        const UID = await client.join(appId, channelName, agoraToken, uid || null);
        console.log("✅ Joined Agora Channel with UID:", UID);

        // 4️⃣ Create & publish audio track
        const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(micTrack);
        await client.publish([micTrack]);
        console.log("🎤 Local audio published");

        // 5️⃣ Listen to remote users
        client.on("user-published", async (user, mediaType) => {
          console.log("📡 Remote user published:", user.uid, mediaType);
          await client.subscribe(user, mediaType);
          console.log("✅ Subscribed to user:", user.uid);
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        client.on("connection-state-change", (cur, prev) => {
          console.log("Agora Connection State:", prev, "➡", cur);
        });
      } catch (err) {
        console.error("❌ VoiceRoom Init Error:", err);
      }
    };

    init();

    return () => {
      const cleanup = async () => {
        console.log("🔻 Leaving Agora Channel...");
        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
        }
        await client.leave();
        console.log("✅ Left channel");
      };
      cleanup();
    };
  }, [channelName]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "#1B4F72",
        color: "white",
        padding: "8px 16px",
        borderRadius: "12px",
      }}
    >
      🎤 Voice Chat Active
      <button
        style={{
          marginLeft: 10,
          background: "red",
          border: "none",
          color: "white",
          padding: "4px 8px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={onLeave}
      >
        Leave
      </button>
    </div>
  );
};

export default VoiceRoom;
