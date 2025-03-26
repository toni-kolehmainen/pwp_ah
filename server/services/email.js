const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { outdatedBidsAndAuctions } = require('./helpers');
const { User, Auction, Item } = require('../models');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'dariana.kovacek84@ethereal.email',
    pass: 'sYA42nH19Q24xb3JVY'
  }
});

const winningBidEmail = (userName, auctionTitle, itemName, bidAmount, auctionEndTime) => `
    Subject: 🎉 Congratulations! You Have the Winning Bid on Your Auction

    Dear ${userName},

    Great news! You are the highest bidder for the auction **"${auctionTitle}"** that just ended. 🎉

    Here are the details of your winning bid:
    - **Auction Item:** ${itemName}
    - **Final Bid Amount:** $${bidAmount}
    - **Auction End Time:** ${auctionEndTime}

    To proceed with the next steps, please check your account for payment and item collection details.

    If you have any questions, feel free to contact us.

    Thank you for participating, and congratulations on your win!

    Best regards,
    [Your Company Name]
    [Your Support Email] | [Your Website]
  `;

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (from, to, subject, text) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Dariana Kovacek84 👻" <dariana.kovacek84@ethereal.email>', // sender address
    to: `${to}, ${to}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${text}`, // plain text body
    html: `<b>${text}</b>` // html body
  });

  console.log('Message sent: %s', info.messageId);
};

const emailSended = async (auctionId) => {
  // console.log(auctionId)

  const count = await Auction.update(
    { emaidSend: true },
      {
        where: {
          emaid_send: false,
          id: { [Op.in]: auctionId } // Ensure this matches your database column name
        }
      }
  );
  // console.log(count)
};

const auctionEndListener = async () => {
  const currentTime = new Date();

  const condition = {
    end_time: { [Op.lt]: currentTime },
    emaid_send: false
  };
  const needEmailSend = await outdatedBidsAndAuctions(
    condition,
    {
      auction: [],
      bid: [{
        model:
        User,
        attributes: { exclude: ['password'] }
      },
      {
        model: Auction,
        include: [
          {
            model: Item, // Include the Item model
            attributes: ['name'], // Specify the attributes you want from the Item model
            required: true, // This ensures the auction will only return if the related Item exists
            as: 'item' // Optionally, you can use aliasing for cleaner references
          },
          {
            model: User, // Include the Item model
            attributes: ['name'], // Specify the attributes you want from the Item model
            required: true, // This ensures the auction will only return if the related Item exists
            as: 'seller' // Optionally, you can use aliasing for cleaner references
          }
        ]
      }]
    },
    true
  );
  const updateAuctions = needEmailSend.outdatedBids.map((data) => {
    const from = 'Dariana Kovacek84'; // get from ethereal.email
    const to = data['user.email'];
    const subject = '🎉 Congratulations! You Have the Winning Bid on Your Auction';

    const text = winningBidEmail(
      data['user.name'],
      `Create by ${data['auction.seller.name']}`,
      data['auction.item.name'],
      data.amount,
      data['auction.end_time']
    );

    sendEmail(from, to, subject, text);
    return data['auction.id']
  });

  await emailSended(updateAuctions)
};

module.exports = {
  auctionEndListener
};
