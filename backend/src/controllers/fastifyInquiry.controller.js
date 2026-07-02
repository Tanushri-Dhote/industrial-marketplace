const Inquiry = require("../models/Inquiry");
const sendEmail = require("../utils/sendEmail");

const validateVRM = async (req, reply) => {
  try {
    let {
      vrm,
      brand,
      model,
      year,
      engineType,
      category,
      engineOptions,
      fittingOptions,
      postcode,
      notes,
      name,
      email,
      phone,
    } = req.body;

    // Step 1: Validation
    if (vrm) {
      vrm = vrm.replace(/\s+/g, "").toUpperCase();
      const ukVrmRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;
      if (!ukVrmRegex.test(vrm)) {
        return reply.status(400).send({ success: false, message: "Invalid UK registration number" });
      }
    }

    if (postcode) {
      const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
      if (!ukPostcodeRegex.test(postcode)) {
        return reply.status(400).send({ success: false, message: "Invalid UK postcode" });
      }
    }

    if (phone) {
      // UK Phone Regex (Mobiles starting with 07, Landlines 01/02)
      const ukPhoneRegex = /^(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|(?:\+44\s?|0)1\d{2}\s?\d{7}|(?:\+44\s?|0)2\d{1}\s?\d{8})$/;
      if (!ukPhoneRegex.test(phone.replace(/\s+/g, ""))) {
        return reply.status(400).send({ success: false, message: "Invalid UK phone number" });
      }
    }

    if (!vrm && (!brand || !model)) {
      if (name && email && phone) {
         return reply.status(400).send({ success: false, message: "Vehicle details are required" });
      }
    }

    // Step 2: If FULL FORM exists → save
    if (name && email && phone) {
      const inquiry = await Inquiry.create({
        registrationNumber: vrm || undefined,
        brand,
        model,
        year,
        engineType,
        category,
        engineOptions,
        fittingOptions,
        postcode,
        notes,
        name,
        email,
        phone,
      });

      // Send emails asynchronously
      try {
        const adminSubject = `New Quote Inquiry from ${name} (${vrm || brand || "Manual"})`;
        const adminText = `
You have received a new quote inquiry:

Customer Name: ${name}
Email: ${email}
Phone: ${phone}
Postcode: ${postcode || "N/A"}

Vehicle Details:
----------------
VRM: ${vrm || "N/A"}
Brand: ${brand || "N/A"}
Model: ${model || "N/A"}
Year: ${year || "N/A"}
Engine Type: ${engineType || "N/A"}
Category: ${category || "N/A"}

Requirements:
-------------
Condition: ${engineOptions?.join(", ") || "N/A"}
Fitting: ${fittingOptions?.join(", ") || "N/A"}
Notes: ${notes || "None"}
`;
        await sendEmail(process.env.EMAIL_USER, adminSubject, adminText);

        const customerSubject = `Quote Request Received - ${brand || model ? `${brand || ""} ${model || ""}` : (vrm || "Inquiry")}`;
        const customerText = `
Hello ${name},

Thank you for requesting a quote. We have received your inquiry for the following vehicle:

Vehicle: ${brand || model ? `${brand || ""} ${model || ""} ${year ? `(${year})` : ""}`.trim() : (vrm ? `Reg: ${vrm}` : "N/A")}
Engine Type: ${engineType || "N/A"}

Our team is reviewing your requirements and will contact you shortly with the best options.

Best regards,
The Engines Team
`;
        await sendEmail(email, customerSubject, customerText);
      } catch (emailErr) {
        console.error("Failed to send inquiry emails:", emailErr);
      }

      return reply.send({
        success: true,
        message: "Inquiry saved",
        data: inquiry,
      });
    }

    // Step 3: Only validation (no save)
    return reply.send({
      success: true,
      message: "Validated",
      data: {
        vrm,
        brand,
        model,
        category,
      },
    });

  } catch (error) {
    console.error("ERROR:", error);

    return reply.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

const getInquiries = async (req, reply) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return reply.send({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("GET_INQUIRIES_ERROR:", error);
    return reply.status(500).send({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};

const deleteInquiry = async (req, reply) => {
  try {
    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);
    return reply.send({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_INQUIRY_ERROR:", error);
    return reply.status(500).send({
      success: false,
      message: "Failed to delete inquiry",
    });
  }
};

module.exports = {
  validateVRM,
  getInquiries,
  deleteInquiry,
};