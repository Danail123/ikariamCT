// export default function handler(req, res) {
//   if (req.method === "POST") {
//     const { player, town, coordinates } = req.body;

//     console.log("Received data:", { player, town, coordinates });

//     // You could save this to a database here

//     return res.status(200).json({
//       message: `Saved player ${player} in town ${town} at ${coordinates}.`,
//     });
//   }

//   // Optional: handle GET or reject other methods
//   res.setHeader("Allow", ["POST"]);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }
