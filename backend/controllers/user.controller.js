const User = require("../models/user.model");
const Event = require("../models/event.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const {
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
  FIREBASE_UNIVERSAL_DOMAIN,
} = require("../config/env.config");

admin.initializeApp({
  credential: admin.credential.cert({
    type: FIREBASE_TYPE,
    project_id: FIREBASE_PROJECT_ID,
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY,
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: FIREBASE_AUTH_URI,
    token_uri: FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: FIREBASE_UNIVERSAL_DOMAIN,
  }),
});

async function createUser(req, res) {
  const { name, password, email } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please enter the name",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }

    const checkForexistingUser = await User.findOne({ email });

    if (checkForexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
    });

    let token = await generateToken({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function login(req, res) {
  const { password, email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    const checkForexistingUser = await User.findOne({ email });

    if (!checkForexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    let checkForPass = await bcrypt.compare(
      password,
      checkForexistingUser.password
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    let token = await generateToken({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        id: checkForexistingUser._id,
        name: checkForexistingUser.name,
        email: checkForexistingUser.email,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function googleAuth(req, res) {
  const { accessToken } = req.body;
  try {
    const response = await getAuth().verifyIdToken(accessToken);

    const { email, name, picture } = response;

    let user = await User.findOne({ email });

    if (user) {
      let token = await generateToken({
        email: user.email,
        id: user._id,
      });

      return res.status(200).json({
        success: true,
        message: "logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePic: user.profilePic,
          token,
        },
      });
    }

    let newUser = await User.create({
      name,
      email,
      profilePic: picture,
    });

    let token = await generateToken({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const id = req.params.id;

    const user = await User.findById(id);


    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    // db call
    const id = req.params.id;

    const { name, password, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, password, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }

    await Event.deleteMany({ user: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
    });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  googleAuth,
};
