require("dotenv").config();
const router = require("express").Router();
// eslint-disable-next-line no-unused-vars
const passportService = require("../services/passport");
const passport = require("passport");
const Authentication = require("../controllers/authentication");
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

// const generateFakeData = require('')//import funciton from somewhere

const requireSignin = passport.authenticate("local", { session: false });
const requireAuth = passport.authenticate("jwt", { session: false });

router.post("/auth/login", requireSignin, Authentication.signin);

router.get("/auth/current_user", requireAuth, async (req, res) => {
  res.send({
    name: req.user.name,
    email: req.user.email,
    id: req.user.id,
  });
});

router.get("/api/user/:userId", async (req, res) => {
  const org = await prisma.user.findFirst({
    where: { id: req.params.userId },
    include: {
      org: {
        include: {
          boards: true,
          members: true,
        },
      },
    },
  });
  res.json(org);
});
//GET a user based on userId with an "org" property with a list of "boards"

router.post("/api/org", async (req, res) => {
  const org = await prisma.organization.create({
    data: {
      name: req.body.name
    },
  });
  res.json(org);
});
//ADD new Organization

router.post("/api/org/:orgId/user", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      org: {
        connect: { id: req.params.orgId }
      },
    }
  });
  res.json(user);
});
//ADD new User to an Organization

router.post("/api/org/:orgId/user/:userId/boards", async (req, res) => {
  const board = await prisma.board.create({
    data: {
      title: req.body.title,
      Organization: { connect: { id: req.params.orgId } },
    },
  });
  res.json(board);
});
//ADD a board to org associated with user

router.get("/api/org/:orgId/user/:userId/boards/:boardId", async (req, res) => {
  const board = await prisma.board.findFirst({
    where: { id: req.params.boardId },
    include: {
      lists: true,
      cards: {
        include: {
          comments: true,
        }
      },
    },
  });
  res.json(board);
});
//GET a board based on url param with an array of "lists", where each list has an array of "cards"

router.put("/api/org/:orgId/user/:userId/boards/:boardId", async (req, res) => {
  if (req.query.reordercards === '1') {
    let updatedCards = []
    for (const newCard of req.body.newCards) {
      const card = await prisma.card.update({
        where: { id: newCard.id },
        data: {
          order: newCard.order,
          List: { connect: { id: newCard.listId } }
        },
      });
      updatedCards.push(card)
    }
    return res.json(updatedCards);
  }

  if (req.query.reorderlists === '1') {
    let updatedLists = []
    for (const newList of req.body.newLists) {
      const list = await prisma.list.update({
        where: { id: newList.id },
        data: { order: newList.order }
      });
      updatedLists.push(list)
    }
    return res.json(updatedLists);
  }

  const board = await prisma.board.update({
    where: { id: req.params.boardId },
    data: req.body,
    include: {
      lists: true,
      cards: true,
    }
  });
  res.json(board);
});
//UPDATE a board

router.post("/api/org/:orgId/user/:userId/boards/:boardId/lists", async (req, res) => {
  const list = await prisma.list.create({
    data: {
      description: req.body.description,
      order: req.body.order,
      Board: { connect: { id: req.params.boardId } },
    },
  });
  res.json(list);
});
//ADD a list to a board

router.delete(
  "/api/org/:orgId/user/:userId/boards/:boardId",
  async (req, res) => {
    const board = await prisma.board.delete({
      where: { id: req.params.boardId },
    });
    res.json(board);
  }
);
//DELETE board (should be removed from the org its associated with as well)

router.post("/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards", async (req, res) => {
  const card = await prisma.card.create({
    data: {
      title: req.body.title,
      order: req.body.order,
      List: {
        connect: { id: req.params.listId },
      },
      Board: {
        connect: { id: req.params.boardId },
      },
    },
  });
  res.json(card);
});
///ADD a card to a list

router.put(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId",
  async (req, res) => {
    const list = await prisma.list.update({
      where: { id: req.params.listId },
      data: req.body,
    });
    res.json(list);
  }
);
//UPDATE a list

router.delete(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId",
  async (req, res) => {
    const list = await prisma.list.delete({
      where: { id: req.params.listId },
    });
    res.json(list);
  }
);
//DELETE list

router.get(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  async (req, res) => {
    const card = await prisma.card.findFirst({
      where: { id: req.params.cardId },
      include: { comments: true },
    });
    res.json(card);
  }
);
//GET a card with an array of "comments"

router.put(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  async (req, res) => {
    const card = await prisma.card.update({
      where: { id: req.params.cardId },
      data: req.body,
    });
    res.json(card);
  }
);
//UPDATE a Card

router.delete(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  async (req, res) => {
    const list = await prisma.card.delete({
      where: { id: req.params.cardId },
    });
    res.json(list);
  }
);
//DELETE card

router.post("/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId/comments", async (req, res) => {
  const comment = await prisma.comment.create({
    data: {
      text: req.body.text,
      user: { connect: { id: req.params.userId } },
      Card: { connect: { id: req.params.cardId } },
    },
  });
  res.json(comment);
});
///create a new comment for card with id

router.put(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId/comments/:commentId",
  async (req, res) => {
    const comment = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: req.body,
    });
    res.json(comment);
  }
);
//UPDATE a comment with id

router.delete(
  "/api/org/:orgId/user/:userId/boards/:boardId/lists/:listId/cards/:cardId/comments/:commentId",
  async (req, res) => {
    const comment = await prisma.comment.delete({
      where: { id: req.params.commentId },
    });
    res.json(comment);
  }
);
//DELETE a comment with id

router.delete("/api/clear", async (req, res) => {
  await prisma.board.deleteMany();
  res.send(200, "All Boards Deleted Successfully");
});

module.exports = router;
