import express from 'express';
import * as dotenv from 'dotenv'
import { init as initDatabase } from "./database";


dotenv.config();
const port = process.env.PORT
const app = express()
app.use( 
  
  function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }
  );

app.use(express.json())

async function init() {

  const db = await initDatabase();
    
  app.get('/pessoa', async (req, res) => {
    const result = await db.all("SELECT * FROM pessoa");
    res.json(result)
  });
  
  app.post('/pessoa', async function (req, res) {
    if (!req.body.nome || !req.body.sobrenome || !req.body.apelido) {
        res.json({ error: "dados incompletos." });
        return;
    }
    try {
        const responseData = await db.run(
            "INSERT INTO pessoa(nome, sobrenome, apelido) VALUES(:nome, :sobrenome, :apelido)",
            {
                ":nome": req.body.nome,
                ":sobrenome": req.body.sobrenome,
                ":apelido": req.body.apelido
            }
        );
        res.json(responseData);
    } catch (e) {
        res.json({ error: "database error", detail: e });
    }
});
  // espera requisições `GET` na rota `/pessoa/:id`.
  app.get('/pessoa/:id', async (req, res) => {
    const responseData = await db.get("SELECT * FROM pessoa WHERE id=? LIMIT 1", req.params.id);
    if (responseData == undefined) {
      res.status(404); // Not Found      
      res.json({ error: "Pessoa não encontrada." });
  } else {
      res.json(responseData);
  }
});
  
  // espera requisições `PUT` na rota `/pessoa/:id`.
  app.put('/pessoa/:id', async (req, res) => {
    console.log(req.body)
    if (!req.body.nome || !req.body.sobrenome || !req.body.apelido) {
      res.status(422); // Unprocessable Entity
      res.json({ error: "dados incompletos." });
      return;
  }  
  try {
     const responseData = await db.run(
          "UPDATE pessoa SET nome=:nome, sobrenome=:sobrenome, apelido=:apelido WHERE id=:id",
          {
              ":id": req.params.id,
              ":nome": req.body.nome,
              ":sobrenome": req.body.sobrenome,
              ":apelido": req.body.apelido
          }
      );
      if (responseData == undefined) {
        res.status(404); // Not Found
        res.json({ error: "Pessoa não encontrada." });
      }   
          res.json(responseData);
      }catch (e) {
      
      res.status(500); // Internal Server Error
      
      res.json({ error: "database error", detail: e });
    }
  }
);

// espera requisições `DELETE` na rota `/pessoa/:id`.
app.delete('/pessoa/:id', async (req, res) =>{
  const responseData = await db.run("DELETE FROM pessoa WHERE id=?", req.params.id);
    if(responseData.changes == 0) {
      res.status(404); // Not Found
      res.json({ error: "Pessoa não encontrada." });
      } else {
        res.json({ "Success": "Perfil removido com sucesso"});
      }
    }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

}

init();










