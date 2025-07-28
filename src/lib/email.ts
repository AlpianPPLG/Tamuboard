import nodemailer from 'nodemailer';

/**
 * Interface for contact form data
 */ 
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Transporter for sending emails
 */ 
// Create a test account if in development
const createTransporter = async () => {
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // For production, use a more reliable email service
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Missing required email configuration');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const transporterPromise = createTransporter();

/**
 * Send contact email
 */ 
export async function sendContactEmail(data: ContactFormData) {
  const transporter = await transporterPromise;
  const mailOptions = {
    from: `"${data.name}" <${process.env.EMAIL_USER}>`,
    to: 'Nova07pplg@gmail.com',
    replyTo: data.email,
    subject: `[Kontak] ${data.subject}`,
    text: `
      Anda menerima pesan baru dari halaman kontak:
      
      Nama: ${data.name}
      Email: ${data.email}
      Subjek: ${data.subject}
      
      Pesan:
      ${data.message}
      
      --
      Email ini dikirim secara otomatis dari Aplikasi Buku Tamu Digital
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Pesan Baru dari Halaman Kontak</h2>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <p><strong>Nama:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Subjek:</strong> ${data.subject}</p>
          <p><strong>Pesan:</strong></p>
          <div style="background: white; padding: 10px; border-radius: 4px; white-space: pre-line;">
            ${data.message}
          </div>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Email ini dikirim secara otomatis dari Aplikasi Buku Tamu Digital. 
          Untuk membalas, gunakan alamat email yang tercantum di atas.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

// Fungsi untuk mengirim email feedback tamu
export async function sendFeedbackEmail(guestName: string, feedback: string) {
  const transporter = await transporterPromise;
  const mailOptions = {
    from: `"Buku Tamu Digital" <${process.env.EMAIL_USER}>`,
    to: 'Nova07pplg@gmail.com',
    subject: `Feedback dari Tamu: ${guestName}`,
    text: `
      Anda menerima feedback baru dari tamu:
      
      Nama Tamu: ${guestName}
      
      Isi Feedback:
      ${feedback}
      
      --
      Email ini dikirim secara otomatis dari Aplikasi Buku Tamu Digital
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Feedback Baru dari Tamu</h2>
        <p>Anda menerima feedback baru dari tamu:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <p><strong>Nama Tamu:</strong> ${guestName}</p>
          <p><strong>Isi Feedback:</strong></p>
          <p style="white-space: pre-line; background: white; padding: 10px; border-radius: 4px;">${feedback}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Email ini dikirim secara otomatis dari Aplikasi Buku Tamu Digital. Mohon tidak membalas email ini.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
