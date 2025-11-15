"use client";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useTranslations } from "next-intl";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AnimatedCounter from "@/components/AnimatedCounter";
import Image from "next/image";

export default function AboutPage() {
  const t = useTranslations("common.about");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const stats = [
    {
      value: 1500,
      suffix: "+",
      labelKey: "stats.clients",
      icon: (
        <PeopleOutlineIcon
          sx={{ fontSize: { xs: 40, sm: 64 }, color: "#004975" }}
        />
      ),
    },
    {
      value: 2000,
      suffix: "+",
      labelKey: "stats.injectors",
      icon: (
        <Image
          src="/images/fuel.png"
          alt="Injectors"
          width={isMobile ? 40 : 64}
          height={isMobile ? 40 : 64}
        />
      ),
    },
    {
      value: 1500,
      suffix: "+",
      labelKey: "stats.pumps",
      icon: (
        <Image
          src="/images/pump.png"
          alt="Injectors"
          width={isMobile ? 40 : 64}
          height={isMobile ? 40 : 64}
        />
      ),
    },
  ];

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: "#F8F9FA" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#004975",
              mb: 2,
            }}
          >
            {t("title")}
          </Typography>

          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              color: "#666",
              mb: 6,
              fontWeight: 400,
            }}
          >
            {t("subtitle")}
          </Typography>

          <Card
            sx={{
              mb: 6,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.9,
                  color: "#333",
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
                {t("intro")}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.9,
                  color: "#333",
                  fontSize: "1.1rem",
                }}
              >
                {t("reputation")}
              </Typography>
            </CardContent>
          </Card>

          <Box
            sx={{
              my: 8,
              py: 6,
              px: { xs: 2, md: 4 },
              background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "row" },
                flexWrap: "nowrap",
                justifyContent: "space-around",
                alignItems: "center",
                gap: { xs: 1, md: 3 },
              }}
            >
              {stats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    position: "relative",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "@media (hover: hover)": {
                      "&:hover": {
                        transform: "translateY(-8px)",
                        "& .stat-icon": {
                          transform: "scale(1.15)",
                          color: "#004975",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    className="stat-icon"
                    sx={{
                      color: "#0077BE",
                      mb: 2,
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: "inline-block",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: "bold",
                      color: "#004975",
                      mb: 1,
                      fontSize: { xs: "2rem", md: "3.5rem" },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2500}
                    />
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666",
                      fontWeight: 500,
                      fontSize: { xs: "0.8rem", sm: "1.05rem" },
                    }}
                  >
                    {t(stat.labelKey)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Card
            sx={{
              mb: 6,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderRadius: 3,
              borderLeft: "6px solid #004975",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 28px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: "#004975",
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                {t("expertiseTitle")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.9,
                  color: "#333",
                  mb: 3,
                  fontSize: "1.05rem",
                }}
              >
                {t("expertiseText")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.9,
                  color: "#333",
                  fontSize: "1.05rem",
                }}
              >
                {t("equipmentText")}
              </Typography>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderRadius: 3,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      color: "#004975",
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  >
                    {t("ourMission")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: "#555",
                      fontSize: "1.05rem",
                    }}
                  >
                    {t("missionText")}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      color: "#004975",
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  >
                    {t("ourAdvantages")}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[
                      "modernEquipment",
                      "experiencedMasters",
                      "warranty",
                      "fastService",
                      "originalParts",
                      "diagnostic",
                    ].map((key) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateX(10px)",
                            "& .advantage-dot": {
                              transform: "scale(1.4)",
                              backgroundColor: "#004975",
                            },
                          },
                        }}
                      >
                        <Box
                          className="advantage-dot"
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#00A86B",
                            mr: 2,
                            flexShrink: 0,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#555",
                            fontSize: "1.05rem",
                          }}
                        >
                          {t(`advantages.${key}`)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
