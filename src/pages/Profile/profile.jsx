import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography, Avatar, Button, Grid, Card, CardContent, Divider } from '@mui/material';
import { getCurrentUser } from '@/service/userService/getUser';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();

      setUser(currentUser.data);
    };

    fetchUser();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#eee', p: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {/* Breadcrumb */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/profile">
              Admin
            </Link>
            <Typography color="textPrimary">Admin Profile</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                alt="Admin"
                src={user?.avatar}
                sx={{ width: 150, height: 150, mb: 2, margin: '0 auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
              />
              <Typography sx={{ marginTop: '10px' }} variant="h5">
                {user?.username}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Full Stack Developer
              </Typography>
              <Typography color="textSecondary">T1 Faker</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" sx={{ mr: 1 }}>
                  Update
                </Button>
                <Button variant="outlined">Message</Button>
              </Box>
            </CardContent>
          </Card>

          {/* Social Links */}
        </Grid>

        <Grid item xs={12} md={8}>
          {/* User Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold">
                INFORMATION
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Full Name:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" color="textSecondary">
                    {user?.username}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Email:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" color="textSecondary">
                    {user?.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Phone:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" color="textSecondary">
                    {user?.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body1" fontWeight="bold">
                    Address:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" color="textSecondary">
                    {user?.address}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
