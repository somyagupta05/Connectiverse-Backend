const newUser = async (req, res) => {
  try {
    const avatar = {
      public_id: "Sdfsd",
      url: "asdfd",
    };

    const user = await User.create({
      name: "chaman",
      username: "chaman",
      password: "chaman",
      avatar,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};
