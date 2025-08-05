import { DataSource } from "typeorm";
import { ContentSection } from "../models/entities/ContentSection";
import { ContentItem } from "../models/entities/ContentItem";
import { Testimonial } from "../models/entities/Testimonial";
import { FAQ } from "../models/entities/FAQ";

const heroSlides = [
  {
    title: "Celebrate",
    description:
      "Showcase, Connect, and Discover – A hub of innovation across industries.",
    image_url: "/images/background4.jpg",
    metadata: {
      highlight: "Life's Special",
      subtitle: "Moments",
    },
    display_order: 1,
  },
  {
    title: "Empower",
    description:
      "Network with pioneers and unlock the future of trade and industry.",
    image_url: "/images/background1.jpg",
    metadata: {
      highlight: "Business Leaders",
      subtitle: "In Africa",
    },
    display_order: 2,
  },
  {
    title: "Innovate",
    description:
      "Collaborate and create impact across communities and markets.",
    image_url: "/images/background8.jpg",
    metadata: {
      highlight: "With Bold Ideas",
      subtitle: "That Shape Tomorrow",
    },
    display_order: 3,
  },
];

const partnerItems = [
  {
    title: "Partner 1",
    description: "Partner 1 Description",
    image_url: "/images/partner1.png",
    display_order: 1,
  },
  {
    title: "Partner 2",
    description: "Partner 2 Description",
    image_url: "/images/partner2.png",
    display_order: 2,
  },
  {
    title: "Partner 3",
    description: "Partner 3 Description",
    image_url: "/images/partner3.png",
    display_order: 3,
  },
  {
    title: "Partner 4",
    description: "Partner 4 Description",
    image_url: "/images/partner4.png",
    display_order: 4,
  },
  {
    title: "Partner 5",
    description: "Partner 5 Description",
    image_url: "/images/partner5.png",
    display_order: 5,
  },
];

const featureItems = [
  {
    title: "Keynote Speakers",
    description: "Learn from renowned industry experts and visionaries.",
    display_order: 1,
  },
  {
    title: "Workshops & Panels",
    description:
      "Interactive sessions to sharpen your skills and expand your knowledge.",
    display_order: 2,
  },
  {
    title: "Networking Opportunities",
    description: "Connect with peers, recruiters, and potential partners.",
    display_order: 3,
  },
  {
    title: "Modern Venue",
    description:
      "Experience a state-of-the-art venue with cutting-edge technology and comfortable seating.",
    display_order: 4,
  },
  {
    title: "New People",
    description: "Meet new people and make new friends.",
    display_order: 5,
  },
  {
    title: "Certificates",
    description: "Get a certificate of participation after the event.",
    display_order: 6,
  },
];

const eventItems = [
  {
    title: "Events That Leave a Impression",
    description:
      "A personal portfolio is a curated collection of an individual's professional work",
    image_url: "/images/background5.jpg",
    metadata: {
      date: "7th November 2025",
      time: "10 AM to 10 PM",
      location: "Tafawa Balewa Square, Lagos, Nigeria",
    },
    display_order: 1,
  },
  {
    title: "Sparkle & Shine on Celebrations",
    description:
      "A personal portfolio is a curated collection of an individual's professional work",
    image_url: "/images/background6.jpg",
    metadata: {
      date: "8th November 2025",
      time: "10 AM to 10 PM",
      location: "Tafawa Balewa Square, Lagos, Nigeria",
    },
    display_order: 2,
  },
  {
    title: "Sparkle & Shine Events",
    description:
      "A personal portfolio is a curated collection of an individual's professional work",
    image_url: "/images/background7.jpg",
    metadata: {
      date: "9th November 2025",
      time: "10 AM to 10 PM",
      location: "Tafawa Balewa Square, Lagos, Nigeria",
    },
    display_order: 3,
  },
];

const testimonials = [
  {
    name: "Mr. Babajide Sanwo-Olu",
    title: "Governor, Lagos State",
    content: "Well organized collaborative trade fair",
    display_order: 1,
  },
  {
    name: "Dr. Femi Hamzat",
    title: "Deputy Governor, Lagos State",
    content:
      "Grateful to the President all management team of LCCI for another International Trade Fair in Lagos. This exercise and event is necessary and important for the lifeline of our economy in Lagos. Trade is key and needed for the survival of our economy. Lagos is a giant market and Trade and deal centre. It is therefore important that we keep working with LCCI to make sure that our businesses survive and keep going well in Lagos. This is our promise. Business will get all our attention and support in order to do well and thrive in our state. It is our promise as a government. Thanks to all those who make it possible for the Trade Fair to happen",
    date: "01/11/2024",
    display_order: 2,
  },
  {
    name: "Rev Bunmi Jenyo",
    title:
      "Honorable Commissioner, Ministry of Commerce and Industry, Osun State",
    content:
      "On behalf of the Governor and the good people of Osun State, I wish the Lagos Chamber of Commerce and happy celebration of the 2024 Trade fair. Best of luck.",
    display_order: 3,
  },
  {
    name: "Oluoranti Doherty",
    title: "MD, Export Development, Afreximbank",
    content:
      "Congratulations to the President and members of LCCI for once again delivering a very impactful 38th edition of the Lagos International Trade Fair. Afreximbank stands ready to continue to support you in advancing trade across Africa in aiding the AfCFTA.",
    display_order: 4,
  },
  {
    name: "Dame Winifred Akpani, OFR",
    title: "MD/CEO Northwest Petroleum and Gas Co Ltd",
    content:
      "Hearty congratulations to the Lagos Chamber of Commerce on the occasion of the 2024 Lagos International Trade Fair. Stronger and ever growing over One Hundred and Forty Years. Great appreciation to the organizer. We are grateful for the continued partnership. Wish you many many more years of success.",
    display_order: 5,
  },
  {
    name: "Ashlly Braganza",
    title: "Provost and Dean, Brunel Business School",
    content:
      "On behalf of Brunel University of London and Brunel Business School, I would like to thank LCCI and its leadership team, present and past, who have great vision and foresight. Thank you for the opportunity to work with SMEs and we look forward to building on our strong start.",
    display_order: 6,
  },
  {
    name: "H.E Silas A. Agara",
    title: "Director General, NDE",
    content:
      "Very impressed with the Chamber for the platform to showcase the product of our beneficiary. The organization/security arrangement is perfect and commendable.",
    display_order: 7,
  },
  {
    name: "Dr. Zaccheus Adedeji",
    title: "Chairman, FIRS",
    content:
      "On behalf of the Federal Inland Revenue Service(FIRS), I wish to specially commend the Lagos Chamber of Commerce and Industry for their overwhelmingly supporting FIRS through Tax Compliance, Tax payment timely and regularly, in order to help the nation meets her responsibilities to the citizens. We salute your courage in pushing forward businesses despite various challenges in the nations economy environment and FIRS promises to keep collaborating with LCCI in prior to foster our cordial relationship going forward. All the best",
    display_order: 8,
  },
];

const faqs = [
  {
    category: "general",
    question: "What is the Lagos International Trade Fair?",
    answer:
      "The Lagos International Trade Fair (LITF) is an annual trade exhibition organized by the Lagos Chamber of Commerce and Industry (LCCI). It is one of West Africa's largest trade fairs, bringing together businesses, entrepreneurs, and industry leaders from across Africa and beyond.",
    display_order: 1,
  },
  {
    category: "general",
    question: "When and where will LITF 2025 take place?",
    answer:
      "LITF 2025 is scheduled to take place from November 7th to 16th, 2025, at the Tafawa Balewa Square in Lagos, Nigeria.",
    display_order: 2,
  },
  {
    category: "general",
    question: "Who can participate in the trade fair?",
    answer:
      "The trade fair is open to manufacturers, distributors, service providers, SMEs, large corporations, government agencies, NGOs, and anyone interested in business networking and trade opportunities across various sectors.",
    display_order: 3,
  },
  {
    category: "booth-booking",
    question: "How do I book a booth for my business?",
    answer:
      "You can book a booth by registering on our platform, selecting your preferred booth size and location, and completing the payment process. Early booking is recommended as spaces are limited.",
    display_order: 1,
  },
  {
    category: "booth-booking",
    question: "What are the different booth sizes available?",
    answer:
      "We offer various booth sizes to accommodate different business needs: Standard booths (3m x 3m), Premium booths (4m x 4m), and Large booths (6m x 6m). Each comes with different amenities and visibility levels.",
    display_order: 2,
  },
  {
    category: "booth-booking",
    question: "Can I customize my booth design?",
    answer:
      "Yes, you can customize your booth design within the allocated space. We also provide basic booth setup services, or you can work with our recommended vendors for custom designs.",
    display_order: 3,
  },
  {
    category: "booth-booking",
    question: "What is included in the booth rental?",
    answer:
      "Standard booth rental includes basic booth structure, electricity connection, WiFi access, security, cleaning services, and inclusion in the official trade fair directory and website.",
    display_order: 4,
  },
  {
    category: "payment",
    question: "What are the payment methods accepted?",
    answer:
      "We accept various payment methods including bank transfers, credit/debit cards, and mobile money payments. All payments are processed securely through our payment gateway.",
    display_order: 1,
  },
  {
    category: "payment",
    question: "Is there a payment plan available?",
    answer:
      "Yes, we offer flexible payment plans for booth bookings. You can pay in installments with a minimum 50% deposit required upon booking confirmation.",
    display_order: 2,
  },
  {
    category: "payment",
    question: "What is the refund policy?",
    answer:
      "Cancellations made 60 days before the event are eligible for 80% refund. Cancellations made 30-59 days before receive 50% refund. No refunds are available for cancellations made less than 30 days before the event.",
    display_order: 3,
  },
  {
    category: "event-info",
    question: "What time does the trade fair open daily?",
    answer:
      "The trade fair is open daily from 10:00 AM to 10:00 PM throughout the event duration (November 7-16, 2025).",
    display_order: 1,
  },
  {
    category: "event-info",
    question: "Is there parking available at the venue?",
    answer:
      "Yes, we provide ample parking space for both exhibitors and visitors. VIP parking is available for premium booth holders.",
    display_order: 2,
  },
  {
    category: "event-info",
    question: "Will there be networking events and seminars?",
    answer:
      "Yes, we have scheduled various networking sessions, industry seminars, panel discussions, and keynote speeches throughout the 10-day event. These sessions are designed to facilitate business connections and knowledge sharing.",
    display_order: 3,
  },
  {
    category: "event-info",
    question:
      "Are there accommodation recommendations for out-of-town participants?",
    answer:
      "Yes, we have partnerships with several hotels in Lagos offering special rates for LITF participants. Contact our customer service for accommodation assistance and booking.",
    display_order: 4,
  },
  {
    category: "registration",
    question: "How do I register as a visitor?",
    answer:
      "Visitors can register online through our website or register on-site at the venue. Online pre-registration is recommended for faster entry and access to digital materials.",
    display_order: 1,
  },
  {
    category: "registration",
    question: "Is there an entrance fee for visitors?",
    answer:
      "General admission is free for all visitors. However, access to VIP areas, special seminars, and networking events may require separate registration and fees.",
    display_order: 2,
  },
  {
    category: "registration",
    question: "Do I need any documents for registration?",
    answer:
      "For exhibitor registration, you'll need business registration documents, tax identification, and company profile. Visitors only need basic contact information for registration.",
    display_order: 3,
  },
  {
    category: "support",
    question: "Who can I contact for technical support during the event?",
    answer:
      "Our technical support team will be available on-site throughout the event. You can also reach our helpdesk at +234-XXX-XXXX-XXX or email support@lccitradeFair.com.",
    display_order: 1,
  },
  {
    category: "support",
    question: "Are there food and refreshment options at the venue?",
    answer:
      "Yes, we have multiple food courts and refreshment stands throughout the venue offering various local and international cuisine options.",
    display_order: 2,
  },
  {
    category: "support",
    question: "Is the venue accessible for people with disabilities?",
    answer:
      "Yes, Tafawa Balewa Square is fully accessible with ramps, accessible restrooms, and designated parking spaces for people with disabilities.",
    display_order: 3,
  },
];

export class InitialSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log("🌱 Starting content seeding...");

      // Clear existing data using query builder to avoid empty criteria error
      console.log("Clearing existing data...");
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ContentItem)
        .execute();
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Testimonial)
        .execute();
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(FAQ)
        .execute();
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(ContentSection)
        .execute();

      console.log("Creating hero section...");
      // Create Hero Section
      const heroSection = await queryRunner.manager.save(ContentSection, {
        section_key: "hero",
        title: "LIFT 2025 - Lagos International Trade Fair",
        content: "Lagos International Trade Fair 2025",
        metadata: {
          event_date: "November 7th – 16th, 2025",
          location: "Tafawa Balewa Square, Lagos",
          button_text: "Book a Booth →",
        },
        display_order: 1,
      });

      console.log("Creating hero slides...");
      // Hero slides
      await queryRunner.manager.save(
        ContentItem,
        heroSlides.map((slide) => ({
          ...slide,
          section_id: heroSection.id,
        }))
      );

      console.log("Creating about section...");
      // Create About Section
      const aboutSection = await queryRunner.manager.save(ContentSection, {
        section_key: "about",
        title: "Lagos Chamber of Commerce and Industry",
        content:
          "Founded in 1888, the Lagos Chamber of Commerce and Industry is the Premier Chamber of Commerce in Nigeria. Incorporated in 1950 as a non-profit organization, LCCI promotes the interests of the business community in Lagos and across Nigeria.",
        metadata: {
          image_url: "/images/tbs-lagos.jpg",
          button_text: "Learn More",
        },
        display_order: 2,
      });

      console.log("Creating partner items...");
      // Partners
      await queryRunner.manager.save(
        ContentItem,
        partnerItems.map((item) => ({
          ...item,
          section_id: aboutSection.id,
        }))
      );

      console.log("Creating features section...");
      // Create Features Section
      const featuresSection = await queryRunner.manager.save(ContentSection, {
        section_key: "features",
        title: "Why should you join our event?",
        content:
          "Discover the amazing opportunities and benefits of participating in our trade fair.",
        display_order: 3,
      });

      console.log("Creating feature items...");
      // Features items
      await queryRunner.manager.save(
        ContentItem,
        featureItems.map((item) => ({
          ...item,
          section_id: featuresSection.id,
        }))
      );

      console.log("Creating events section...");
      // Create Events Section
      const eventsSection = await queryRunner.manager.save(ContentSection, {
        section_key: "events",
        title: "Tech & Trade Event Schedule",
        content: "Event Schedule for the Lagos International Trade Fair 2025",
        metadata: {
          subtitle: "Event Schedule",
        },
        display_order: 4,
      });

      console.log("Creating event items...");
      // Event items
      await queryRunner.manager.save(
        ContentItem,
        eventItems.map((item) => ({
          ...item,
          section_id: eventsSection.id,
        }))
      );

      console.log("Creating testimonials...");
      // Create Testimonials
      await queryRunner.manager.save(Testimonial, testimonials);

      console.log("Creating footer section...");
      // Create Footer Section
      const footerSection = await queryRunner.manager.save(ContentSection, {
        section_key: "footer",
        title: "Footer",
        content:
          "The Lagos International Trade Fair is Nigeria's premier platform for trade, innovation, and business networking, held annually in Lagos.",
        metadata: {
          copyright_text: `© ${new Date().getFullYear()} Lagos International Trade Fair. All rights reserved.`,
          address: "1, Idowu Taylor Street, Victoria Island, Lagos",
          phone: "+234 700 524 6724",
          email: "litf@lagoschamber.com",
          social_links: {
            facebook: "https://www.facebook.com/lagoschamber",
            twitter: "https://www.x.com/lagoschamber88",
            linkedin: "https://www.linkedin.com/company/lagoschamber",
            instagram: "https://www.instagram.com/lagos_tradefair",
          },
        },
        display_order: 10,
      });

      console.log("Creating contact-page section...");
      // Create Contact Page Section
      const contactPageSection = await queryRunner.manager.save(
        ContentSection,
        {
          section_key: "contact-page",
          title: "Contact Us",
          content:
            "We're here to help you connect, exhibit, and grow at the Lagos International Trade Fair.",
          metadata: {
            main_office: {
              address:
                "The Director, Trade Promotion\nLagos Chamber of Commerce and Industry\n1st Floor, Commerce House\n1, Idowu Taylor Street, Victoria Island, Lagos.",
              phone: "0700LAGOSCHAMBER (07005246724)",
              email: "litf@lagoschamber.com",
              working_hours: "Monday - Friday: 8:00 AM - 5:00 PM",
            },
            support_office: {
              address:
                "Support Office\nLagos Chamber of Commerce and Industry\n2nd Floor, Commerce House\n1, Idowu Taylor Street, Victoria Island, Lagos.",
              phone: "+234 1 2701814",
              email: "support@lagoschamber.com",
              working_hours: "Monday - Friday: 9:00 AM - 4:00 PM",
            },
          },
          display_order: 12,
        }
      );

      console.log("Creating about-page section...");
      // Create About Page Section
      // Create About Page Section
      const aboutPageSection = await queryRunner.manager.save(ContentSection, {
        section_key: "about-page",
        title: "About Us Page",
        content:
          "Complete about us page content with mission, vision, and history",
        metadata: {
          mission:
            "To promote trade, commerce and industry in Lagos State and Nigeria",
          vision: "To be the premier business support organization in Africa",
          established: "1888",
          incorporated: "1950",
          about_fair_content: `The Lagos International Trade Fair is the largest International Trade Fair in Nigeria. The spectacular 10-day event usually begins on the first Friday in November of every year, since 1981. The Lagos Chamber of Commerce and Industry (LCCI) took over the organisation of the fair in 1986 and has been staging the fair annually to date.

Since then, the Lagos International Trade Fair has grown tremendously in popularity to become the leading forum for Trade and Business promotion in Nigeria, and indeed Africa. The Chamber is uniquely aware of the high standards expected of an International Trade Fair, and it is, therefore, constantly striving to live up to this expectation.

Key Features:
• Accessible location in Lagos, the commercial and industrial heartland of Nigeria
• Supported by Federal and Lagos State Governments, and the private sector
• Opportunities for sector groups and professionals to present new products and ideas
• Hospitality and tourism programs for foreign visitors
• Assistance from experienced Trade Promotion Board members and LCCI staff

The Fair brings into focus the full potentials and business opportunities existing in Nigeria, with eminent dignitaries and policy makers attending throughout its duration.`,
        },
        display_order: 11,
      });

      // Create About Page Feature Items
      await queryRunner.manager.save(ContentItem, [
        {
          title: "Largest International Trade Fair in Nigeria",
          content:
            "Held annually since 1981, attracting exhibitors and visitors from all over the world.",
          display_order: 1,
          is_active: true,
          section: aboutPageSection,
        },
        {
          title: "Business & Networking",
          content:
            "A hub for top organizations, policy makers, and professionals to connect and collaborate.",
          display_order: 2,
          is_active: true,
          section: aboutPageSection,
        },
        {
          title: "Diverse Participation",
          content:
            "Open to local and foreign exhibitors, with growing interest and attendance every year.",
          display_order: 3,
          is_active: true,
          section: aboutPageSection,
        },
        {
          title: "Wide Publicity",
          content:
            "Extensive media coverage and unique opportunities for product and service promotion.",
          display_order: 4,
          is_active: true,
          section: aboutPageSection,
        },
      ]);

      console.log("Creating FAQs...");
      // Create FAQs
      await queryRunner.manager.save(FAQ, faqs);

      await queryRunner.commitTransaction();
      console.log("✅ Content seeding completed successfully!");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ Error seeding content:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
