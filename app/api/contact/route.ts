import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  service?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create contact message in Convex
    const contactId = await convex.mutation(api.contact.createContactMessage, {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      company: body.company?.trim() || undefined,
      subject: body.subject.trim(),
      message: body.message.trim(),
      service: body.service || undefined,
      ipAddress,
      userAgent,
    });

    // Log successful submission (optional)
    console.log(`New contact message received: ${contactId} from ${body.email}`);

    return NextResponse.json({
      success: true,
      message: 'Contact message sent successfully',
      id: contactId,
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message. Please try again or contact us directly.' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is working',
    timestamp: new Date().toISOString(),
  });
}
