const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const newMercedesModels = [
	// A-Class
	{ model: "A 140", startYear: 1997, endYear: 2004, type: "Hatchback" },
	{ model: "A 150", startYear: 2004, endYear: 2012, type: "Hatchback" },
	{ model: "A 160", startYear: 1997, endYear: 2012, type: "Hatchback" },
	{ model: "A 170", startYear: 1998, endYear: 2009, type: "Hatchback" },
	{ model: "A 180", startYear: 2004, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "A 190", startYear: 1999, endYear: 2004, type: "Hatchback" },
	{ model: "A 200", startYear: 2004, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "A 210", startYear: 2002, endYear: 2004, type: "Hatchback" },
	{ model: "A 220", startYear: 2012, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "A 250", startYear: 2012, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "A 35 AMG", startYear: 2018, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "A 45 AMG", startYear: 2013, endYear: "Present", type: "Hatchback" },

	// B-Class
	{ model: "B 150", startYear: 2005, endYear: 2009, type: "Hatchback; MPV" },
	{ model: "B 160", startYear: 2009, endYear: 2011, type: "Hatchback; MPV" },
	{ model: "B 170", startYear: 2005, endYear: 2009, type: "Hatchback; MPV" },
	{ model: "B 180", startYear: 2009, endYear: "Present", type: "Hatchback; MPV" },
	{ model: "B 200", startYear: 2005, endYear: "Present", type: "Hatchback; MPV" },
	{ model: "B 220", startYear: 2013, endYear: "Present", type: "Hatchback; MPV" },
	{ model: "B 250", startYear: 2012, endYear: "Present", type: "Hatchback; MPV" },

	// C-Class
	{ model: "C 160", startYear: 2002, endYear: 2020, type: "Saloon; Coupe; Estate" },
	{ model: "C 180", startYear: 1993, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "C 200", startYear: 1993, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "C 220", startYear: 1993, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "C 230", startYear: 1996, endYear: 2009, type: "Saloon; Estate; Coupe" },
	{ model: "C 240", startYear: 1997, endYear: 2005, type: "Saloon; Estate" },
	{ model: "C 250", startYear: 2008, endYear: 2018, type: "Saloon; Estate; Coupe" },
	{ model: "C 270", startYear: 2000, endYear: 2005, type: "Saloon; Estate" },
	{ model: "C 280", startYear: 1993, endYear: 2009, type: "Saloon; Estate" },
	{ model: "C 300", startYear: 2007, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "C 320", startYear: 2000, endYear: 2009, type: "Saloon; Estate; Coupe" },
	{ model: "C 350", startYear: 2005, endYear: 2018, type: "Saloon; Estate; Coupe" },
	{ model: "C 400", startYear: 2014, endYear: 2021, type: "Saloon; Estate" },
	{ model: "C 43 AMG", startYear: 1997, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "C 63 AMG", startYear: 2008, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },

	// E-Class
	{ model: "E 200", startYear: 1993, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 220", startYear: 1993, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 230", startYear: 1995, endYear: 2009, type: "Saloon; Estate" },
	{ model: "E 240", startYear: 1997, endYear: 2005, type: "Saloon; Estate" },
	{ model: "E 250", startYear: 2009, endYear: 2016, type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 270", startYear: 1999, endYear: 2005, type: "Saloon; Estate" },
	{ model: "E 280", startYear: 1993, endYear: 2009, type: "Saloon; Estate" },
	{ model: "E 290", startYear: 1996, endYear: 1999, type: "Saloon; Estate" },
	{ model: "E 300", startYear: 1993, endYear: "Present", type: "Saloon; Estate" },
	{ model: "E 320", startYear: 1993, endYear: 2009, type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 350", startYear: 2005, endYear: "Present", type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 400", startYear: 2013, endYear: 2018, type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 430", startYear: 1997, endYear: 2002, type: "Saloon; Estate" },
	{ model: "E 500", startYear: 1993, endYear: 2016, type: "Saloon; Estate; Coupe; Cabriolet" },
	{ model: "E 55 AMG", startYear: 1997, endYear: 2006, type: "Saloon; Estate" },
	{ model: "E 63 AMG", startYear: 2006, endYear: "Present", type: "Saloon; Estate" },

	// S-Class
	{ model: "S 280", startYear: 1993, endYear: 2005, type: "Saloon" },
	{ model: "S 300", startYear: 1993, endYear: 2013, type: "Saloon" },
	{ model: "S 320", startYear: 1993, endYear: 2009, type: "Saloon" },
	{ model: "S 350", startYear: 2002, endYear: "Present", type: "Saloon" },
	{ model: "S 400", startYear: 1999, endYear: "Present", type: "Saloon" },
	{ model: "S 420", startYear: 1993, endYear: 2010, type: "Saloon" },
	{ model: "S 430", startYear: 1998, endYear: 2005, type: "Saloon" },
	{ model: "S 450", startYear: 2005, endYear: "Present", type: "Saloon" },
	{ model: "S 500", startYear: 1993, endYear: "Present", type: "Saloon" },
	{ model: "S 550", startYear: 2005, endYear: 2020, type: "Saloon" },
	{ model: "S 560", startYear: 2017, endYear: 2020, type: "Saloon; Coupe; Cabriolet" },
	{ model: "S 580", startYear: 2020, endYear: "Present", type: "Saloon" },
	{ model: "S 600", startYear: 1993, endYear: 2020, type: "Saloon" },
	{ model: "S 63 AMG", startYear: 2001, endYear: "Present", type: "Saloon; Coupe; Cabriolet" },
	{ model: "S 65 AMG", startYear: 2004, endYear: 2019, type: "Saloon; Coupe; Cabriolet" },

	// G-Class
	{ model: "G 270", startYear: 2001, endYear: 2006, type: "SUV" },
	{ model: "G 300", startYear: 1993, endYear: 2001, type: "SUV" },
	{ model: "G 320", startYear: 1994, endYear: 2006, type: "SUV" },
	{ model: "G 350", startYear: 2009, endYear: "Present", type: "SUV" },
	{ model: "G 400", startYear: 2000, endYear: "Present", type: "SUV" },
	{ model: "G 500", startYear: 1993, endYear: "Present", type: "SUV" },
	{ model: "G 55 AMG", startYear: 1999, endYear: 2012, type: "SUV" },
	{ model: "G 63 AMG", startYear: 2012, endYear: "Present", type: "SUV" },
	{ model: "G 65 AMG", startYear: 2012, endYear: 2018, type: "SUV" },

	// GLA-Class
	{ model: "GLA 180", startYear: 2014, endYear: "Present", type: "SUV" },
	{ model: "GLA 200", startYear: 2013, endYear: "Present", type: "SUV" },
	{ model: "GLA 220", startYear: 2014, endYear: "Present", type: "SUV" },
	{ model: "GLA 250", startYear: 2013, endYear: "Present", type: "SUV" },
	{ model: "GLA 35 AMG", startYear: 2020, endYear: "Present", type: "SUV" },
	{ model: "GLA 45 AMG", startYear: 2014, endYear: "Present", type: "SUV" },

	// GLB-Class
	{ model: "GLB 180", startYear: 2020, endYear: "Present", type: "SUV" },
	{ model: "GLB 200", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "GLB 220", startYear: 2020, endYear: "Present", type: "SUV" },
	{ model: "GLB 250", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "GLB 35 AMG", startYear: 2020, endYear: "Present", type: "SUV" },

	// GLC-Class
	{ model: "GLC 200", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLC 220", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLC 250", startYear: 2015, endYear: 2019, type: "SUV; Coupe" },
	{ model: "GLC 300", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLC 350", startYear: 2016, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLC 400", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "GLC 43 AMG", startYear: 2016, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLC 63 AMG", startYear: 2017, endYear: "Present", type: "SUV; Coupe" },

	// GLE
	{ model: "GLE 250", startYear: 2015, endYear: 2018, type: "SUV" },
	{ model: "GLE 300", startYear: 2018, endYear: "Present", type: "SUV" },
	{ model: "GLE 350", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLE 400", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLE 450", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLE 500", startYear: 2015, endYear: 2018, type: "SUV" },
	{ model: "GLE 580", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "GLE 43 AMG", startYear: 2016, endYear: 2019, type: "SUV; Coupe" },
	{ model: "GLE 53 AMG", startYear: 2019, endYear: "Present", type: "SUV; Coupe" },
	{ model: "GLE 63 AMG", startYear: 2015, endYear: "Present", type: "SUV; Coupe" },

	// GLS
	{ model: "GLS 350", startYear: 2015, endYear: 2019, type: "SUV" },
	{ model: "GLS 400", startYear: 2015, endYear: "Present", type: "SUV" },
	{ model: "GLS 450", startYear: 2016, endYear: "Present", type: "SUV" },
	{ model: "GLS 500", startYear: 2015, endYear: 2019, type: "SUV" },
	{ model: "GLS 580", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "GLS 600", startYear: 2020, endYear: "Present", type: "SUV" },
	{ model: "GLS 63 AMG", startYear: 2015, endYear: "Present", type: "SUV" },

	// GL-Class
	{ model: "GL 320", startYear: 2006, endYear: 2009, type: "SUV" },
	{ model: "GL 350", startYear: 2009, endYear: 2015, type: "SUV" },
	{ model: "GL 420", startYear: 2006, endYear: 2009, type: "SUV" },
	{ model: "GL 450", startYear: 2006, endYear: 2015, type: "SUV" },
	{ model: "GL 500", startYear: 2006, endYear: 2015, type: "SUV" },
	{ model: "GL 550", startYear: 2008, endYear: 2012, type: "SUV" },

	// GLK-Class
	{ model: "GLK 200", startYear: 2010, endYear: 2015, type: "SUV" },
	{ model: "GLK 220", startYear: 2008, endYear: 2015, type: "SUV" },
	{ model: "GLK 250", startYear: 2009, endYear: 2015, type: "SUV" },
	{ model: "GLK 280", startYear: 2008, endYear: 2009, type: "SUV" },
	{ model: "GLK 300", startYear: 2009, endYear: 2015, type: "SUV" },
	{ model: "GLK 320", startYear: 2008, endYear: 2009, type: "SUV" },
	{ model: "GLK 350", startYear: 2008, endYear: 2015, type: "SUV" },

	// CLK
	{ model: "CLK 200", startYear: 1997, endYear: 2009, type: "Coupe; Convertible" },
	{ model: "CLK 220", startYear: 2005, endYear: 2009, type: "Coupe" },
	{ model: "CLK 230", startYear: 1997, endYear: 2003, type: "Coupe; Convertible" },
	{ model: "CLK 240", startYear: 2002, endYear: 2005, type: "Coupe; Convertible" },
	{ model: "CLK 270", startYear: 2002, endYear: 2005, type: "Coupe" },
	{ model: "CLK 280", startYear: 2005, endYear: 2009, type: "Coupe; Convertible" },
	{ model: "CLK 320", startYear: 1997, endYear: 2005, type: "Coupe; Convertible" },
	{ model: "CLK 350", startYear: 2005, endYear: 2009, type: "Coupe; Convertible" },
	{ model: "CLK 430", startYear: 1998, endYear: 2003, type: "Coupe; Convertible" },
	{ model: "CLK 500", startYear: 2002, endYear: 2009, type: "Coupe; Convertible" },
	{ model: "CLK 55 AMG", startYear: 1999, endYear: 2006, type: "Coupe; Convertible" },
	{ model: "CLK 63 AMG", startYear: 2006, endYear: 2009, type: "Coupe; Convertible" },

	// CLS
	{ model: "CLS 280", startYear: 2008, endYear: 2009, type: "Coupe" },
	{ model: "CLS 300", startYear: 2009, endYear: 2014, type: "Coupe" },
	{ model: "CLS 320", startYear: 2005, endYear: 2009, type: "Coupe" },
	{ model: "CLS 350", startYear: 2004, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLS 400", startYear: 2014, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLS 450", startYear: 2018, endYear: "Present", type: "Coupe" },
	{ model: "CLS 500", startYear: 2004, endYear: 2018, type: "Coupe; Shooting Brake" },
	{ model: "CLS 53 AMG", startYear: 2018, endYear: "Present", type: "Coupe" },
	{ model: "CLS 55 AMG", startYear: 2005, endYear: 2006, type: "Coupe" },
	{ model: "CLS 63 AMG", startYear: 2006, endYear: 2018, type: "Coupe; Shooting Brake" },

	// SL
	{ model: "SL 280", startYear: 1998, endYear: 2009, type: "Convertible" },
	{ model: "SL 300", startYear: 2009, endYear: 2012, type: "Convertible" },
	{ model: "SL 320", startYear: 1993, endYear: 2001, type: "Convertible" },
	{ model: "SL 350", startYear: 2003, endYear: 2020, type: "Convertible" },
	{ model: "SL 380", startYear: 1980, endYear: 1985, type: "Convertible" },
	{ model: "SL 400", startYear: 2014, endYear: 2020, type: "Convertible" },
	{ model: "SL 450", startYear: 2016, endYear: 2020, type: "Convertible" },
	{ model: "SL 500", startYear: 1993, endYear: 2020, type: "Convertible" },
	{ model: "SL 55 AMG", startYear: 2001, endYear: 2008, type: "Convertible" },
	{ model: "SL 600", startYear: 1993, endYear: 2012, type: "Convertible" },
	{ model: "SL 63 AMG", startYear: 2008, endYear: "Present", type: "Convertible; Coupe" },
	{ model: "SL 65 AMG", startYear: 2004, endYear: 2018, type: "Convertible" },

	// SLK
	{ model: "SLK 200", startYear: 1996, endYear: 2016, type: "Roadster" },
	{ model: "SLK 230", startYear: 1996, endYear: 2004, type: "Roadster" },
	{ model: "SLK 280", startYear: 2005, endYear: 2009, type: "Roadster" },
	{ model: "SLK 300", startYear: 2009, endYear: 2016, type: "Roadster" },
	{ model: "SLK 320", startYear: 2000, endYear: 2004, type: "Roadster" },
	{ model: "SLK 350", startYear: 2004, endYear: 2016, type: "Roadster" },
	{ model: "SLK 55 AMG", startYear: 2004, endYear: 2016, type: "Roadster" },

	// SLC
	{ model: "SLC 180", startYear: 2016, endYear: 2020, type: "Roadster" },
	{ model: "SLC 200", startYear: 2016, endYear: 2020, type: "Roadster" },
	{ model: "SLC 300", startYear: 2016, endYear: 2020, type: "Roadster" },
	{ model: "SLC 43 AMG", startYear: 2016, endYear: 2020, type: "Roadster" },

	// AMG GT
	{ model: "AMG GT", startYear: 2014, endYear: "Present", type: "Coupe; Roadster" },
	{ model: "AMG GT S", startYear: 2014, endYear: 2020, type: "Coupe; Roadster" },
	{ model: "AMG GT C", startYear: 2017, endYear: 2021, type: "Coupe; Roadster" },
	{ model: "AMG GT R", startYear: 2017, endYear: 2021, type: "Coupe" },
	{ model: "AMG GT 43", startYear: 2018, endYear: "Present", type: "4-Door Coupe" },
	{ model: "AMG GT 53", startYear: 2018, endYear: "Present", type: "4-Door Coupe" },
	{ model: "AMG GT 63", startYear: 2018, endYear: "Present", type: "4-Door Coupe" },

	// CLA
	{ model: "CLA 180", startYear: 2013, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLA 200", startYear: 2013, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLA 220", startYear: 2013, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLA 250", startYear: 2013, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLA 35 AMG", startYear: 2019, endYear: "Present", type: "Coupe; Shooting Brake" },
	{ model: "CLA 45 AMG", startYear: 2013, endYear: "Present", type: "Coupe; Shooting Brake" },

	// Sprinter
	{ model: "Sprinter 211", startYear: 1995, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 213", startYear: 2000, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 216", startYear: 2000, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 311", startYear: 1995, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 313", startYear: 2000, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 314", startYear: 2016, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 316", startYear: 1995, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 319", startYear: 2009, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 515", startYear: 2006, endYear: 2018, type: "Van; Bus; Platform" },
	{ model: "Sprinter 516", startYear: 2006, endYear: "Present", type: "Van; Bus; Platform" },
	{ model: "Sprinter 519", startYear: 2009, endYear: "Present", type: "Van; Bus; Platform" },

	// Vito
	{ model: "Vito 108", startYear: 1996, endYear: 2003, type: "Van; Bus" },
	{ model: "Vito 109", startYear: 2003, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 110", startYear: 1996, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 111", startYear: 2003, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 112", startYear: 1999, endYear: 2003, type: "Van; Bus" },
	{ model: "Vito 113", startYear: 1996, endYear: 2014, type: "Van; Bus" },
	{ model: "Vito 114", startYear: 2014, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 115", startYear: 2003, endYear: 2010, type: "Van; Bus" },
	{ model: "Vito 116", startYear: 2010, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 119", startYear: 2014, endYear: "Present", type: "Van; Bus" },
	{ model: "Vito 120", startYear: 2006, endYear: 2010, type: "Van; Bus" },

	// Viano
	{ model: "Viano 2.0", startYear: 2003, endYear: 2014, type: "MPV" },
	{ model: "Viano 2.2", startYear: 2003, endYear: 2014, type: "MPV" },
	{ model: "Viano 3.0", startYear: 2006, endYear: 2014, type: "MPV" },
	{ model: "Viano 3.2", startYear: 2003, endYear: 2004, type: "MPV" },
	{ model: "Viano 3.5", startYear: 2007, endYear: 2014, type: "MPV" },
	{ model: "Viano 3.7", startYear: 2004, endYear: 2007, type: "MPV" },

	// Citan
	{ model: "Citan 108", startYear: 2012, endYear: 2021, type: "Van; MPV" },
	{ model: "Citan 109", startYear: 2012, endYear: 2021, type: "Van; MPV" },
	{ model: "Citan 111", startYear: 2013, endYear: 2021, type: "Van; MPV" },
	{ model: "Citan 112", startYear: 2013, endYear: 2021, type: "Van; MPV" },

	// X-Class
	{ model: "X 220d", startYear: 2017, endYear: 2020, type: "Pickup" },
	{ model: "X 250d", startYear: 2017, endYear: 2020, type: "Pickup" },
	{ model: "X 350d", startYear: 2018, endYear: 2020, type: "Pickup" },

	// MB100
	{ model: "MB 100D", startYear: 1987, endYear: 1996, type: "Van; Bus" },

	// MB140
	{ model: "MB 140D", startYear: 1999, endYear: 2004, type: "Van; Bus" },

	// R-Class
	{ model: "R 280", startYear: 2007, endYear: 2009, type: "MPV" },
	{ model: "R 300", startYear: 2009, endYear: 2012, type: "MPV" },
	{ model: "R 320", startYear: 2006, endYear: 2009, type: "MPV" },
	{ model: "R 350", startYear: 2006, endYear: 2014, type: "MPV" },
	{ model: "R 500", startYear: 2006, endYear: 2012, type: "MPV" },
	{ model: "R 63 AMG", startYear: 2006, endYear: 2007, type: "MPV" },

	// Vaneo
	{ model: "Vaneo 1.6", startYear: 2002, endYear: 2005, type: "MPV" },
	{ model: "Vaneo 1.9", startYear: 2002, endYear: 2005, type: "MPV" },
	{ model: "Vaneo 1.7 CDI", startYear: 2002, endYear: 2005, type: "MPV" },

	// Vario
	{ model: "Vario 512 D", startYear: 1996, endYear: 2006, type: "Van; Bus; Platform" },
	{ model: "Vario 614 D", startYear: 1996, endYear: 2011, type: "Van; Bus; Platform" },
	{ model: "Vario 812 D", startYear: 1996, endYear: 2006, type: "Van; Bus; Platform" },
	{ model: "Vario 814 D", startYear: 1996, endYear: 2013, type: "Van; Bus; Platform" },

	// SLS AMG
	{ model: "SLS AMG Coupe", startYear: 2010, endYear: 2014, type: "Coupe" },
	{ model: "SLS AMG Roadster", startYear: 2011, endYear: 2014, type: "Roadster" },

	// CLC-Class
	{ model: "CLC 160", startYear: 2009, endYear: 2011, type: "Coupe" },
	{ model: "CLC 180", startYear: 2008, endYear: 2011, type: "Coupe" },
	{ model: "CLC 200", startYear: 2008, endYear: 2011, type: "Coupe" },
	{ model: "CLC 220", startYear: 2008, endYear: 2011, type: "Coupe" },
	{ model: "CLC 230", startYear: 2008, endYear: 2011, type: "Coupe" },
	{ model: "CLC 250", startYear: 2009, endYear: 2011, type: "Coupe" },
	{ model: "CLC 350", startYear: 2008, endYear: 2011, type: "Coupe" },

	// M-Class
	{ model: "ML 270", startYear: 1999, endYear: 2005, type: "SUV" },
	{ model: "ML 280", startYear: 2005, endYear: 2009, type: "SUV" },
	{ model: "ML 320", startYear: 1998, endYear: 2009, type: "SUV" },
	{ model: "ML 350", startYear: 2002, endYear: 2015, type: "SUV" },
	{ model: "ML 400", startYear: 2001, endYear: 2015, type: "SUV" },
	{ model: "ML 420", startYear: 2006, endYear: 2009, type: "SUV" },
	{ model: "ML 500", startYear: 2001, endYear: 2015, type: "SUV" },
	{ model: "ML 63 AMG", startYear: 2006, endYear: 2015, type: "SUV" }
];

async function update() {
	try {
		await connectDB();
		const brand = await Brand.findOne({ slug: "mercedes-benz" });
		if (!brand) {
			console.error("❌ Brand 'mercedes-benz' not found in database.");
			process.exit(1);
		}
		console.log(`Found Mercedes-Benz brand with ID: ${brand._id}`);

		// Delete old models
		const deleteResult = await Model.deleteMany({ brandId: brand._id });
		console.log(`🗑️ Deleted ${deleteResult.deletedCount} old Mercedes-Benz models.`);

		// Prepare new models
		const modelsToInsert = newMercedesModels.map((m) => {
			const name = m.model;
			const yearStr = m.startYear === m.endYear ? m.startYear.toString() : (m.endYear === "Present" ? `${m.startYear} - Present` : `${m.startYear} - ${m.endYear}`);
			const slug = `mercedes-benz-${m.model}-${m.startYear}-${m.endYear}-${m.type}`
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			// Determine sprite position using matching class data
			const nameLower = name.toLowerCase();
			let spriteFields = {};

			// Mercedes matching data
			if (nameLower.startsWith("a ")) {
				spriteFields = {
					spriteClass: "bg-a-class",
					spriteSheetUrl: "/images/car_sprites.png",
					spritePosition: { x: -1215, y: -228 },
					spriteSize: { width: 135, height: 76 }
				};
			} else if (nameLower.startsWith("v ") || nameLower.startsWith("vito") || nameLower.startsWith("viano")) {
				spriteFields = {
					spriteClass: "bg-v-class",
					spriteSheetUrl: "/images/car_sprites.png",
					spritePosition: { x: -1080, y: -76 },
					spriteSize: { width: 135, height: 76 }
				};
			}

			return {
				brandId: brand._id,
				name,
				year: yearStr,
				type: m.type,
				slug,
				...spriteFields,
				isActive: true,
			};
		});

		// Insert new models
		const insertResult = await Model.insertMany(modelsToInsert);
		console.log(`✅ Successfully added ${insertResult.length} new Mercedes-Benz models.`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Update failed:", error);
		process.exit(1);
	}
}

update();
