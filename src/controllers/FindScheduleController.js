const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
const TelegramBot = require('node-telegram-bot-api');

export default {
  async findSchedules(req, res) {
    try {
      const { token, chatId } = process.env;

      const bot = new TelegramBot(token /* { polling: true } */);

      const pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
      });

      await pool.connect();
      const results = await pool.query(
        `SELECT 
      sch.id,
      cli.name,
      sch.start
      FROM schedules sch
      LEFT JOIN clients cli ON sch.client_id = cli.id
      GROUP BY
      sch.id,
      cli.name,
      sch.start
      `,
        (err, results) => {
          console.log('Query terminada');
          pool.end();
          console.log('Pool Terminada');
          const timezone = 'America/Sao_Paulo';
          const starter = results.rows[0].start;
          console.log(starter);
          const resposta = results.rows
            .map(
              (x) =>
                `\n${x.name} -${format(
                  starter,
                  'MM/dd/yyyy - HH:mm',
                  timezone
                )}\n`
            )
            .join('\r');

          /* const resposta = results.rows
            .map(
              (x) =>
                `\n${x.name} - ${format(x.start,'dd/MM/yyyy HH:mm', new Date(),{ locale: ptBR,})}\n`
            )
            .join('\r'); */

          console.log(resposta);
          /*  res.send(
            bot.sendMessage(
              chatId,
              `Olá Adriana, você tem serviço agendado com\n ${resposta}`
            )
          ); */
          bot.startPolling();
          console.log('pooling terminated');
        }
      );
    } catch (error) {
      res.json({ error });
    }
  },
};
