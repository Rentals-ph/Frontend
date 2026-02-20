<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $email;
    public $verificationUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($email, $token)
    {
        $this->email = $email;
        $this->verificationUrl = $this->getFrontendUrl() . '/verify-email?token=' . $token . '&email=' . urlencode($email);
    }

    /**
     * Get the appropriate frontend URL based on environment
     * Uses production URL for emails (since they're accessed from external devices)
     * 
     * For local development:
     * - Set FRONTEND_URL=http://localhost:3000 (for local dev)
     * - Set FRONTEND_URL_PRODUCTION=https://your-production-url.com (for email links)
     * 
     * For local testing with external access (mobile, etc.):
     * - Use a tunnel service like ngrok: FRONTEND_URL_PRODUCTION=https://your-ngrok-url.ngrok.io
     */
    private function getFrontendUrl(): string
    {
        // Priority 1: Explicit production frontend URL (always use for emails)
        $productionUrl = env('FRONTEND_URL_PRODUCTION', env('FRONTEND_URL_PROD'));
        if ($productionUrl) {
            return $productionUrl;
        }

        // Priority 2: Check if we're in production environment
        $isProduction = env('APP_ENV') === 'production' || env('APP_ENV') === 'staging';
        
        // Priority 3: Check if FRONTEND_URL is localhost (development)
        $frontendUrl = env('FRONTEND_URL', env('APP_FRONTEND_URL', 'http://localhost:3000'));
        $isLocalhost = strpos($frontendUrl, 'localhost') !== false || 
                      strpos($frontendUrl, '127.0.0.1') !== false ||
                      strpos($frontendUrl, '192.168.') !== false;

        // If in production environment, try to use APP_URL
        if ($isProduction) {
            $appUrl = config('app.url', env('APP_URL', ''));
            if ($appUrl && strpos($appUrl, 'localhost') === false && strpos($appUrl, '127.0.0.1') === false) {
                return $appUrl;
            }
        }

        // For local development: if FRONTEND_URL is localhost, we need production URL for emails
        // But allow override with USE_LOCAL_URL_FOR_EMAILS=true for testing
        if ($isLocalhost) {
            $useLocalForEmails = env('USE_LOCAL_URL_FOR_EMAILS', false);
            
            if ($useLocalForEmails) {
                // Only use localhost if explicitly allowed (for testing with ngrok/tunnels)
                \Log::info('Using localhost URL for emails (USE_LOCAL_URL_FOR_EMAILS=true)', [
                    'url' => $frontendUrl,
                ]);
                return $frontendUrl;
            }
            
            // Default: warn and use localhost (will not work on mobile/external devices)
            \Log::warning('Email verification using localhost URL - email links will not work on mobile/external devices. Set FRONTEND_URL_PRODUCTION in .env or use a tunnel service.', [
                'current_url' => $frontendUrl,
                'hint' => 'For local testing: Use ngrok or set FRONTEND_URL_PRODUCTION to your production URL',
            ]);
        }

        return $frontendUrl;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $fromAddress = config('mail.from.address', 'noreply@rentals.ph');
        $fromName = config('mail.from.name', 'Rentals.ph');
        
        $message = $this->subject('Verify Your Email Address - Rentals.ph')
            ->from($fromAddress, $fromName)
            ->replyTo($fromAddress, $fromName)
            ->view('emails.verify-email')
            ->text('emails.verify-email-text') // Plain text version for better deliverability
            ->with([
                'email' => $this->email,
                'verificationUrl' => $this->verificationUrl,
            ]);
        
        // Add headers to improve deliverability (Laravel 10 compatible)
        $message->withSymfonyMessage(function ($message) {
            $headers = $message->getHeaders();
            $headers->addTextHeader('List-Unsubscribe', '<' . config('app.url', 'https://rentals.ph') . '/unsubscribe>');
            $headers->addTextHeader('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');
            $headers->addTextHeader('X-Mailer', 'Rentals.ph Email System');
            $headers->addTextHeader('Precedence', 'bulk');
        });
        
        return $message;
    }
}

