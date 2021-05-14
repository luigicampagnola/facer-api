const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        //update the login table
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users") //users insert and return columns
          .returning("*") // connect syntax
          .insert({
            //insert info to database using knex
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]); //connect to front end
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(404).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
