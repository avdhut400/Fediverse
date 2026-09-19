
const axios = require("axios");
const User = require("../models/User");
const { signGetRequest } = require("../utils/httpSignature");


const { sendSignedRequest } = require("../utils/sendSignedRequest");

exports.sendFollow = async (req, res) => {
  const { username } = req.params;
  const { remoteActorUrl } = req.body;

  try {
    const localUser = await User.findOne({ username });
    if (!localUser) return res.status(404).json({ error: "Local user not found" });

    // Step 1: Fetch remote actor to get inbox
    // const actorRes = await axios.get(remoteActorUrl, {
    //   headers: { Accept: "application/activity+json" },
    // });





    // Step 1: Fetch remote actor to get inbox
const actorRes = await axios.get(remoteActorUrl, {
  headers: signGetRequest({
    targetUrl: remoteActorUrl,
    actor: localUser.actorUrl,
  }),
});

    

    const remoteInbox = actorRes.data.inbox;
    if (!remoteInbox) return res.status(400).json({ error: "Remote inbox not found" });

    // Step 2: Create Follow activity
    const followActivity = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${localUser.actorUrl}/follow/${Date.now()}`,
      type: "Follow",
      actor: localUser.actorUrl,
      object: remoteActorUrl,
    };

    // Step 3: Send signed request (this function handles the POST)
    await sendSignedRequest(localUser.username, remoteInbox, followActivity);

    // Step 4: Save the follow locally
    if (!localUser.following.includes(remoteActorUrl)) {
      localUser.following.push(remoteActorUrl);
      await localUser.save();
    }

    res.status(200).json({ message: "Follow request sent", followActivity });

  } catch (err) {
    console.error("❌ Follow error:", err.message);
    res.status(500).json({ error: "Failed to follow remote user" });
  }
};




exports.sendUnfollow = async (req, res) => {
  const { username } = req.params;
  const { remoteActorUrl } = req.body;

  try {
    const localUser = await User.findOne({ username });

    if (!localUser) {
      return res.status(404).json({
        error: "Local user not found",
      });
    }

    // Step 1: Fetch remote actor inbox
    // const actorRes = await axios.get(remoteActorUrl, {
    //   headers: {
    //     Accept: "application/activity+json",
    //   },
    // });















    const actorRes = await axios.get(remoteActorUrl, {
          headers: signGetRequest({
            targetUrl: remoteActorUrl,
            actor: localUser.actorUrl,
          }),
        });

    const remoteInbox = actorRes.data.inbox;

    if (!remoteInbox) {
      return res.status(400).json({
        error: "Remote inbox not found",
      });
    }

    // Step 2: Create Undo Follow activity
    const undoActivity = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${localUser.actorUrl}/undo/${Date.now()}`,
      type: "Undo",
      actor: localUser.actorUrl,
      object: {
        id: `${localUser.actorUrl}/follow/${Date.now()}`,
        type: "Follow",
        actor: localUser.actorUrl,
        object: remoteActorUrl,
      },
    };

    // Step 3: Send signed Undo request
    await sendSignedRequest(
      localUser.username,
      remoteInbox,
      undoActivity
    );

    // Step 4: Remove remote user locally
    localUser.following = localUser.following.filter(
      (actorUrl) => actorUrl !== remoteActorUrl
    );

    await localUser.save();

    return res.status(200).json({
      message: "Unfollow request sent",
      undoActivity,
    });
  } catch (err) {
    console.error("❌ Unfollow error:", err.message);

    return res.status(500).json({
      error: "Failed to unfollow remote user",
    });
  }
};
















exports.removeRemoteFollower = async (req, res) => {
  const { username } = req.params;
  const { remoteActorUrl } = req.body;

  try {
    const localUser = await User.findOne({ username });

    if (!localUser) {
      return res.status(404).json({
        error: "Local user not found",
      });
    }

    const actorRes = await axios.get(remoteActorUrl, {
      headers: {
        Accept: "application/activity+json",
      },
    });













    // const actorRes = await axios.get(remoteActorUrl, {
    //         headers: signGetRequest({
    //           targetUrl: remoteActorUrl,
    //           actor: localUser.actorUrl,
    //         }),
    //       });

    const remoteInbox = actorRes.data.inbox;

    if (!remoteInbox) {
      return res.status(400).json({
        error: "Remote inbox not found",
      });
    }

    const rejectActivity = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${localUser.actorUrl}/reject/${Date.now()}`,
      type: "Reject",
      actor: localUser.actorUrl,
      object: {
        type: "Follow",
        actor: remoteActorUrl,
        object: localUser.actorUrl,
      },
    };

    await sendSignedRequest(
      localUser.username,
      remoteInbox,
      rejectActivity
    );

    localUser.followers = localUser.followers.filter(
      (actorUrl) => actorUrl !== remoteActorUrl
    );

    await localUser.save();

    return res.status(200).json({
      message: "Remote follower removed",
      rejectActivity,
      followers: localUser.followers,
    });
  } catch (err) {
    console.error("Remove remote follower error:", err.message);

    return res.status(500).json({
      error: "Failed to remove remote follower",
    });
  }
};
